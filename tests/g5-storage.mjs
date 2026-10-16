import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {browserRuntime,baseURL} from './helpers.mjs';

const {chromium}=await browserRuntime();
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();
const page=await context.newPage();
const report={command:'node tests/g5-storage.mjs',at:new Date().toISOString(),node:process.version,browser:browser.version(),baseURL,type:'API serviços + IndexedDB real em Chromium; injeções de abort/blocked/relógio identificadas',hashes:{},cases:[],status:'RUNNING'};
report.runtime={PLAYWRIGHT_MODULE:process.env.PLAYWRIGHT_MODULE??'playwright local',PLAYWRIGHT_BROWSERS_PATH:process.env.PLAYWRIGHT_BROWSERS_PATH??'default',platform:process.platform,arch:process.arch};
report.playwright=JSON.parse(await readFile(process.env.PLAYWRIGHT_MODULE?new URL('./package.json',process.env.PLAYWRIGHT_MODULE):new URL('../node_modules/playwright/package.json',import.meta.url),'utf8')).version;
for(const file of ['src/domain/service.js','src/domain/validation.js','src/storage/indexeddb.js','src/data/seed.js']){
  const source=createHash('sha256').update(await readFile(file)).digest('hex'),dist=createHash('sha256').update(await readFile('dist/'+file)).digest('hex');
  report.hashes[file]={source,dist};assert.equal(source,dist,'Dist desatualizado: '+file);
}
await mkdir('evidence/G5',{recursive:true});
try {
  await page.goto(baseURL);
  const result=await page.evaluate(async()=>{
    const {CadastroService}=await import('./src/domain/service.js');
    const {IndexedDBStorage}=await import('./src/storage/indexeddb.js');
    const {criarSeed}=await import('./src/data/seed.js');
    const run='g5-qa-'+crypto.randomUUID();
    const cases=[],storages=[];
    const check=(condition,message)=>{if(!condition)throw Error(message);};
    const equal=(a,b,message)=>check(JSON.stringify(a)===JSON.stringify(b),message);
    const reject=async(fn,expected)=>{try{await fn();}catch(e){check(e.code===expected,`Esperado ${expected}; recebido ${e.code}: ${e.message}`);return {code:e.code,message:e.message};}throw Error(`Operação não rejeitou ${expected}`);};
    const make=(suffix)=>{const st=new IndexedDBStorage(run+'-'+suffix);storages.push(st);return {st,s:new CadastroService(st)};};
    const institution=(code)=>({nome:'Entidade '+code,tipo:'empresa',identificacao:code,uf:'RS',municipio:'Cidade QA'});
    const editable=i=>Object.fromEntries(['nome','tipo','identificacao','uf','municipio','contato','observacoes'].map(k=>[k,i[k]]));
    const token=(b,i,confirmation=false)=>({expectedRevision:b.revisao,expectedUpdatedAt:i.updatedAt,...(confirmation?{confirmacao:true}:{})});
    const envelope=(snapshot)=>({schemaVersion:1,exportedAt:'2026-10-09T12:00:00.000Z',instituicoes:snapshot.instituicoes,ofertas:snapshot.ofertas});
    const rawOpen=(name,version,upgrade)=>new Promise((resolve,reject)=>{const r=indexedDB.open(name,version);r.onupgradeneeded=()=>upgrade?.(r.result,r.transaction);r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});
    const record=async(id,fn)=>{const started=performance.now();try{cases.push({id,status:'PASS',...(await fn()),durationMs:performance.now()-started});}catch(e){cases.push({id,status:'FAIL',message:e.message,stack:e.stack,durationMs:performance.now()-started});}};
    await record('C01',async()=>{
      const a=make('concurrency'), b=make('concurrency');
      await Promise.all([a.s.inicializar(),b.s.inicializar()]);
      const initial=await a.s.obterBase();check(initial.revisao===1,'Seed duplicado entre conexões');
      await Promise.all([a.s.criarInstituicao(institution('PARALELO-A')),b.s.criarInstituicao(institution('PARALELO-B'))]);
      const after=await a.s.obterBase();check(after.revisao===3&&after.instituicoes.length===4,'Lost update entre conexões');
      const staleEdit=await reject(()=>b.s.editarInstituicao(initial.instituicoes[0].id,editable(initial.instituicoes[0]),token(initial,initial.instituicoes[0])),'CONFLICT');
      const staleImport=await reject(()=>b.s.importarBase(JSON.stringify(envelope(criarSeed())),{confirmacao:true,expectedRevision:initial.revisao}),'CONFLICT');
      equal(await a.s.obterBase(),after,'Conflito modificou a base');
      return {connections:2,initial,after,staleEdit,staleImport};
    });
    await record('C02',async()=>{
      const {s,st}=make('abort');await s.inicializar();const before=await st.lerEstado();
      const original=IDBObjectStore.prototype.put;let injected=false;
      IDBObjectStore.prototype.put=function(value,...args){const result=original.call(this,value,...args);if(this.transaction.db.name===st.dbName&&value.chave==='snapshot'){injected=true;this.transaction.abort();}return result;};
      let error;try{error=await reject(()=>s.criarInstituicao(institution('ABORT')),'STORAGE_ERROR');}finally{IDBObjectStore.prototype.put=original;}
      const after=await st.lerEstado();check(injected,'Abort não injetado');equal(before,after,'Abort deixou gravação parcial');
      return {injection:'IDBObjectStore.put nativo executado; transaction.abort imediatamente após snapshot put, antes de complete',before,after,error};
    });
    await record('C03',async()=>{
      const fresh=make('fresh');await fresh.s.inicializar();const before=await fresh.s.obterBase();fresh.st.fechar();await fresh.s.inicializar();equal(before,await fresh.s.obterBase(),'Reabertura repôs seed');
      const version=(await fresh.st.abrir()).version;check(version===1,'Versão inicial não é 1');
      const future=make('future');let db=await rawOpen(future.st.dbName,2,d=>d.createObjectStore('estado',{keyPath:'chave'}));db.close();
      const futureError=await reject(()=>future.s.inicializar(),'VERSION_UNSUPPORTED');db=await rawOpen(future.st.dbName,2);check(db.version===2,'Versão futura alterada');db.close();
      const partialErrors=[];
      for(const only of ['meta','snapshot']){
        const partial=make('partial-'+only);const d=await rawOpen(partial.st.dbName,1,d=>d.createObjectStore('estado',{keyPath:'chave'}));const record=only==='meta'?{chave:'meta',inicializada:true,revisao:1}:criarSeed();
        await new Promise((resolve,reject)=>{const tx=d.transaction('estado','readwrite');tx.objectStore('estado').put(record);tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error);});d.close();
        const error=await reject(()=>partial.s.inicializar(),'STORAGE_ERROR');
        const db=await rawOpen(partial.st.dbName,1);const after=await new Promise((resolve,reject)=>{const req=db.transaction('estado','readonly').objectStore('estado').getAll();req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});db.close();equal(after,[record],'Inicialização resetou base parcial');partialErrors.push({only,error,unchanged:true});
      }
      const name=run+'-blocked';const held=await rawOpen(name,1,d=>d.createObjectStore('estado',{keyPath:'chave'}));
      let request;const synthetic={open:(n)=>{request=indexedDB.open(n,2);return request;}};
      const blocked=new IndexedDBStorage(name,synthetic);storages.push(blocked);
      const blockedError=await reject(()=>blocked.abrir(),'STORAGE_BLOCKED');
      held.close();await new Promise((resolve,reject)=>{const success=request.onsuccess;request.onsuccess=()=>{success?.();resolve();};request.onerror=()=>reject(request.error);});
      check(blocked.connection===null,'Conexão bloqueada tardia ficou aberta');
      return {absentCreatedVersion:version,reopenUnchanged:true,futureError,partialErrors,blockedError,blockedInjection:'IndexedDB real v1 retido; adaptador open redirecionado explicitamente a v2 para disparar blocked nativo. O produto v1 não tem migração pendente real.'};
    });
    const minimal=(nInstitutions,nOffers)=>{
      const seed=criarSeed();
      return {chave:'snapshot',instituicoes:Array.from({length:nInstitutions},(_,i)=>({...seed.instituicoes[0],id:`${(i+1).toString(16).padStart(8,'0')}-1111-4111-8111-111111111111`,nome:'AA',identificacao:'I'+i,municipio:'AA',contato:'',observacoes:''})),ofertas:Array.from({length:nOffers},(_,i)=>({...seed.ofertas[0],id:`${(i+1).toString(16).padStart(8,'0')}-2222-4222-8222-222222222222`,instituicaoId:'00000001-1111-4111-8111-111111111111',recurso:'O'+i,observacoes:''}))};
    };
    await record('C04',async()=>{
      const {s}=make('limits');await s.inicializar();const volumes=[];
      for(const [ni,no] of [[1000,0],[1,5000]]){
        const doc=envelope(minimal(ni,no)),text=JSON.stringify(doc,null,2),bytes=new TextEncoder().encode(text).length;
        check(bytes<=2097152,`Volume ${ni}/${no} conflita com2MiB: ${bytes}`);
        const rev=(await s.obterBase()).revisao;await s.importarBase(text,{confirmacao:true,expectedRevision:rev});
        const base=await s.obterBase();check(base.instituicoes.length===ni&&base.ofertas.length===no,'Contagem limite não persistida');
        const excess=structuredClone(doc);if(ni===1000)excess.instituicoes.push({...doc.instituicoes[0],id:crypto.randomUUID(),identificacao:'EXTRA'});else excess.ofertas.push({...doc.ofertas[0],id:crypto.randomUUID(),recurso:'EXTRA'});
        const error=await reject(()=>s.importarBase(JSON.stringify(excess),{confirmacao:true,expectedRevision:base.revisao}),'LIMIT_EXCEEDED');equal(base,await s.obterBase(),'Excesso contagem gravou');volumes.push({instituicoes:ni,ofertas:no,bytes,error});
      }
      const valid=JSON.stringify(envelope(minimal(1,1)));const exact=valid+' '.repeat(2097152-new TextEncoder().encode(valid).length);
      check(new TextEncoder().encode(exact).length===2097152,'Fixture2MiB não exata');
      const revision=(await s.obterBase()).revisao;await s.importarBase(exact,{confirmacao:true,expectedRevision:revision});const base=await s.obterBase();
      const plusOne=await reject(()=>s.importarBase(exact+' ',{confirmacao:true,expectedRevision:base.revisao}),'LIMIT_EXCEEDED');equal(base,await s.obterBase(),'+1byte gravou');
      return {volumes,bytesExact:2097152,exactAccepted:true,plusOne,byteFixture:'JSON válido compacto + whitespace legal até tamanho UTF8 exato; não há campo extra/inválido.'};
    });
    await record('C06',async()=>{
      const {s}=make('clock');await s.inicializar();const doc=envelope(criarSeed());doc.ofertas[0].updatedAt='2099-01-01T00:00:00.000Z';await s.importarBase(JSON.stringify(doc),{confirmacao:true,expectedRevision:1});
      const originalNow=Date.now;Date.now=()=>0;
      let changed;try{const base=await s.obterBase();changed=await s.editarInstituicao(base.instituicoes[0].id,{...editable(base.instituicoes[0]),nome:'Nome novo'},token(base,base.instituicoes[0]));}finally{Date.now=originalNow;}
      check(changed.updatedAt==='2099-01-01T00:00:00.001Z','Relógio recuado venceu lógico');
      let base=await s.obterBase();const inactive=await s.definirEstadoInstituicao(changed.id,'inativa',token(base,changed,true));base=await s.obterBase();const related=base.ofertas.filter(o=>o.instituicaoId===changed.id);check(related.every(o=>o.updatedAt===inactive.updatedAt),'Cascade não usou instante único');
      await s.definirEstadoInstituicao(changed.id,'inativa',token(base,inactive,true));equal(base,await s.obterBase(),'No-op alterou timestamp/revisão');
      return {clockInjection:'Date.now=()=>0 somente durante edição; restaurado em finally',futureImported:doc.ofertas[0].updatedAt,changed,cascadeTimestamp:inactive.updatedAt,noOpRevision:base.revisao};
    });
    await record('C09',async()=>{
      const {s,st}=make('volume');await s.inicializar();const measurements=[];
      for(const [ni,no] of [[1000,0],[1,5000],[1000,3500]]){
        const text=JSON.stringify(envelope(minimal(ni,no)),null,2),bytes=new TextEncoder().encode(text).length;
        if(bytes>2097152){measurements.push({instituicoes:ni,ofertas:no,bytes,skipped:'Limite bytes precede contagem combinada'});continue;}
        let t=performance.now();await s.importarBase(text,{confirmacao:true,expectedRevision:(await s.obterBase()).revisao});const importarMs=performance.now()-t;
        t=performance.now();const query=await s.consultarOfertas();const consultarMs=performance.now()-t;
        st.fechar();t=performance.now();await st.abrir();const base=await s.obterBase();const abrirLerMs=performance.now()-t;
        t=performance.now();await s.editarInstituicao(base.instituicoes[0].id,{...editable(base.instituicoes[0]),nome:'AB'},token(base,base.instituicoes[0]));const salvarMs=performance.now()-t;
        measurements.push({instituicoes:ni,ofertas:no,bytes,importarMs,consultarMs,abrirLerMs,salvarMs,totalResultado:query.total});
      }
      return {measurements,performanceReviewRequired:measurements.some(m=>m.importarMs>100||m.salvarMs>100),limitation:'Uma execução técnica por fixture no mesmo Chromium headless. Não mede tempo humano, FPS ou latência de interação DOM; valores >100ms exigem avaliação do coordenador.'};
    });
    for(const st of storages)st.fechar();
    return {run,cases};
  });
  Object.assign(report,result);report.status=result.cases.every(c=>c.status==='PASS')?'PASS':'FAIL';
  await writeFile('evidence/G5/storage.json',JSON.stringify(report,null,2));
  console.log(JSON.stringify({status:report.status,cases:report.cases.map(c=>({id:c.id,status:c.status,durationMs:c.durationMs,message:c.message,measurements:c.measurements,volumes:c.volumes}))},null,2));
  assert.equal(report.status,'PASS');
} catch(error) {
  if(report.status==='RUNNING'){report.status='FAIL';report.error=error.message;await writeFile('evidence/G5/storage.json',JSON.stringify(report,null,2));}
  throw error;
} finally {await browser.close();}
