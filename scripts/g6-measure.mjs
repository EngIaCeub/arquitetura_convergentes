import assert from 'node:assert/strict';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {browserRuntime,baseURL} from '../tests/helpers.mjs';

const sha=content=>createHash('sha256').update(content).digest('hex');
const protocolPath='evidence/G6/protocolo-congelado.json';
const protocolText=await readFile(protocolPath,'utf8');
const protocol=JSON.parse(protocolText);
assert.equal(protocol.version,1);assert.equal(protocol.frozenBeforeMeasurements,true);
assert.equal(protocol.repetitionsPerTaskPerMethod,30);assert.equal(protocol.warmupPerTaskPerMethod,3);assert.equal(protocol.participants,0);
assert.deepEqual(protocol.methods,['lista_completa_referencia','sistema_filtrado']);
const inputHashes={};
for(const [file,expected]of Object.entries(protocol.hashes)){
  const actual=sha(await readFile(file.replaceAll('\\','/')));assert.equal(actual,expected,'Entrada congelada alterada: '+file);inputHashes[file]=actual;
}
const versionText=await readFile('evidence/G6/protocolo-versao.json','utf8');
const protocolVersion=JSON.parse(versionText);
for(const [file,expected]of Object.entries(protocolVersion.hashes))assert.equal(sha(await readFile(file.replaceAll('\\','/'))),expected,'Versão congelada alterada: '+file);
assert.ok(Date.parse(protocolVersion.frozenAt)<Date.now(),'Protocolo não foi fixado antes da medição');
const baseText=await readFile('evidence/G6/base-congelada.json','utf8');
const tasks=JSON.parse(await readFile('evidence/G6/tarefas.json','utf8'));
assert.equal(tasks.length,8);assert.equal(JSON.parse(baseText).ofertas.length,12);
const sourceHashes={},distHashes={};
for(const file of ['src/domain/service.js','src/domain/validation.js','src/domain/errors.js','src/storage/indexeddb.js','src/data/seed.js']){
  sourceHashes[file]=sha(await readFile(file));distHashes[file]=sha(await readFile('dist/'+file));assert.equal(sourceHashes[file],distHashes[file],'Dist desatualizado: '+file);
}
const {chromium}=await browserRuntime();
const browser=await chromium.launch({headless:true});
const context=await browser.newContext();
const page=await context.newPage();
const environment={node:process.version,chromium:browser.version(),platform:process.platform,arch:process.arch,baseURL,PLAYWRIGHT_MODULE:process.env.PLAYWRIGHT_MODULE??'playwright local',PLAYWRIGHT_BROWSERS_PATH:process.env.PLAYWRIGHT_BROWSERS_PATH??'default'};
environment.playwright=JSON.parse(await readFile(process.env.PLAYWRIGHT_MODULE?new URL('./package.json',process.env.PLAYWRIGHT_MODULE):new URL('../node_modules/playwright/package.json',import.meta.url),'utf8')).version;
const raw={status:'RUNNING',at:new Date().toISOString(),type:'Técnico sintético; nenhum participante humano',protocolHash:sha(protocolText),protocolVersionHash:sha(versionText),protocolVersion,inputHashes,sourceHashes,distHashes,runnerHash:sha(await readFile('scripts/g6-measure.mjs')),environment,protocol,warmups:0,samples:[]};
await mkdir('evidence/G6',{recursive:true});
try{
  await page.goto(baseURL);
  Object.assign(raw,await page.evaluate(async({baseText,tasks,protocol})=>{
    const {CadastroService}=await import('./src/domain/service.js');
    const {IndexedDBStorage}=await import('./src/storage/indexeddb.js');
    const dbName='g6-measure-'+crypto.randomUUID();
    const storage=new IndexedDBStorage(dbName),service=new CadastroService(storage);
    await service.inicializar();
    await service.importarBase(baseText,{confirmacao:true,expectedRevision:(await service.obterBase()).revisao});
    const baseBefore=await service.obterBase();
    const normalize=value=>value.normalize('NFKD').replace(/\p{M}/gu,'').toLowerCase().trim().replace(/\s+/gu,' ');
    // Scanner independente: não importa helpers/regras do produto nem usa seu boolean compativel.
    function scanReference(items,f){
      return items.filter(({oferta:o,instituicao:i})=>{
        const mode=f.situacao||'compativeis';
        let accepted;
        switch(mode){
          case 'todas':accepted=true;break;
          case 'inativas':accepted=i.estado==='inativa'||o.estado==='inativa';break;
          case 'indisponiveis':accepted=i.estado==='ativa'&&o.estado==='ativa'&&o.disponibilidade==='indisponivel';break;
          default:accepted=i.estado==='ativa'&&o.estado==='ativa'&&o.disponibilidade==='disponivel'&&o.quantidade>0;
        }
        if(!accepted)return false;
        if(f.categoria&&o.categoria!==f.categoria)return false;
        if(f.uf&&i.uf!==f.uf)return false;
        if(f.municipio&&normalize(i.municipio)!==normalize(f.municipio))return false;
        if(f.texto){const text=normalize(f.texto);if(!normalize(i.nome).includes(text)&&!normalize(o.recurso).includes(text))return false;}
        return true;
      }).map(item=>item.oferta.id);
    }
    async function execute(task,method){
      const start=performance.now();
      let actualIds,candidates;
      if(method==='lista_completa_referencia'){
        const complete=await service.consultarOfertas({situacao:'todas'});
        actualIds=scanReference(complete.itens,task.filtros);candidates=complete.total;
      }else{
        const result=await service.consultarOfertas(task.filtros);
        actualIds=result.itens.map(item=>item.oferta.id);candidates=result.total;
      }
      const ms=performance.now()-start;
      const expectedIds=[...task.expectedIds].sort();actualIds.sort();
      return{ms,expectedIds,actualIds,exact:JSON.stringify(actualIds)===JSON.stringify(expectedIds),candidates};
    }
    let warmups=0;const warmupChecks=[],samples=[];
    for(let taskIndex=0;taskIndex<tasks.length;taskIndex++){
      const task=tasks[taskIndex];
      for(let repetition=0;repetition<protocol.warmupPerTaskPerMethod;repetition++){
        const methods=(taskIndex+repetition)%2===0?protocol.methods:[...protocol.methods].reverse();
        for(const method of methods){const result=await execute(task,method);warmups++;warmupChecks.push({taskId:task.id,method,repetition:repetition+1,exact:result.exact,actualIds:result.actualIds});}
      }
      for(let repetition=0;repetition<protocol.repetitionsPerTaskPerMethod;repetition++){
        const methods=(taskIndex+repetition)%2===0?protocol.methods:[...protocol.methods].reverse();
        for(let index=0;index<methods.length;index++){
          const method=methods[index];const result=await execute(task,method);
          samples.push({taskId:task.id,method,repetition:repetition+1,order:index+1,sequence:samples.length+1,...result});
        }
      }
    }
    const baseAfter=await service.obterBase();storage.fechar();
    return{dbName,warmups,warmupChecks,samples,baseBefore,baseAfter,unchanged:JSON.stringify(baseBefore)===JSON.stringify(baseAfter),timer:'performance.now: imediatamente antes de consultarOfertas até map/scanner selecionar IDs; sort/comparação excluídos',orderRule:'taskIndex zero-based + repetition zero-based par => lista primeiro; ímpar => sistema primeiro; order é posição 1/2 no par, sequence é global1..480'};
  },{baseText,tasks,protocol}));
  raw.divergences=raw.samples.filter(sample=>!sample.exact);
  assert.equal(raw.warmups,48);assert.equal(raw.samples.length,480);assert.equal(raw.unchanged,true,'Base mudou durante ensaio');
  for(const task of tasks)for(const method of protocol.methods){const samples=raw.samples.filter(s=>s.taskId===task.id&&s.method===method);assert.equal(samples.length,30);assert.equal(new Set(samples.map(s=>s.repetition)).size,30);assert.equal(samples.filter(s=>s.order===1).length,15);}
  assert.ok(raw.samples.every(s=>Number.isFinite(s.ms)&&s.ms>=0));
  assert.ok(raw.samples.filter(s=>s.method==='lista_completa_referencia').every(s=>s.candidates===12));
  assert.equal(raw.divergences.length,0,'IDs divergentes do gabarito congelado');assert.ok(raw.warmupChecks.every(s=>s.exact),'Divergência no aquecimento');
  raw.status='PASS';await writeFile('evidence/G6/raw.json',JSON.stringify(raw,null,2));
  console.log(JSON.stringify({status:raw.status,samples:raw.samples.length,warmups:raw.warmups,divergences:raw.divergences.length,unchanged:raw.unchanged,environment},null,2));
}catch(error){raw.status='FAIL';raw.error=error.message;await writeFile('evidence/G6/raw.json',JSON.stringify(raw,null,2));throw error;}finally{await browser.close();}
