import test from 'node:test';
import assert from 'node:assert/strict';
import { CadastroService } from '../src/domain/service.js';
import { validarConjunto, validarInstituicao, validarOferta, dataCanonica } from '../src/domain/validation.js';
import { validarEstado, IndexedDBStorage } from '../src/storage/indexeddb.js';
import { criarSeed } from '../src/data/seed.js';

class MemoryStorage {
  state = {};
  async lerEstado() { validarEstado(this.state); return structuredClone(this.state); }
  async mutarEstado(transform) {
    validarEstado(this.state,true);
    const next = transform(structuredClone(this.state));
    validarEstado(next);
    this.state = structuredClone(next);
    return structuredClone(next);
  }
}
const institution = overrides => ({nome:'Demo Nova',tipo:'empresa',identificacao:'DEMO-NOVA',uf:'RS',municipio:'Cidade Alfa',...overrides});
const offer = overrides => ({instituicaoId:criarSeed().instituicoes[0].id,categoria:'agua',recurso:'Água potável',quantidade:4,unidade:'litro',disponibilidade:'disponivel',...overrides});
async function setup() { const storage = new MemoryStorage(); const service = new CadastroService(storage); await service.inicializar(); return {service,storage}; }
const rejects = (promise,code) => assert.rejects(promise,error => error.code === code);

test('seed determinístico, inicialização idempotente e base vazia preservada',async () => {
  assert.deepEqual(criarSeed(),criarSeed());
  assert.equal(validarConjunto(criarSeed()).ofertas.length,3);
  const {service,storage} = await setup();
  assert.deepEqual(await service.inicializar(),{revisao:1,inicializada:true});
  storage.state.snapshot.instituicoes = []; storage.state.snapshot.ofertas = [];
  await service.inicializar();
  assert.deepEqual(await service.obterBase(),{revisao:1,instituicoes:[],ofertas:[]});
});
test('comandos normalizam sem coerção e rejeitam campos gerados/desconhecidos', () => {
  const item = validarInstituicao(institution({nome:'  Demo\t Nova  ',identificacao:'demo-nova',uf:'rs'}));
  assert.equal(item.nome,'Demo Nova'); assert.equal(item.identificacao,'DEMO-NOVA'); assert.equal(item.uf,'RS');
  assert.equal(item.contato,'');
  for (const dados of [institution({nome:123}),institution({id:crypto.randomUUID()}),institution({extra:'x'}),institution({nome:'ab\u0000cd'})]) assert.throws(() => validarInstituicao(dados),{code:'VALIDATION_ERROR'});
  for (const dados of [offer({quantidade:'4'}),offer({quantidade:1.5}),offer({quantidade:0}),offer({categoria:'transporte',unidade:'litro'}),offer({estado:'inativa'})]) assert.throws(() => validarOferta(dados),{code:'VALIDATION_ERROR'});
  assert.equal(validarOferta(offer({quantidade:0,disponibilidade:'indisponivel'})).quantidade,0);
});
test('cadastro de instituição com duas ofertas incrementa revisão e devolve cópias',async () => {
  const {service} = await setup();
  const i = await service.criarInstituicao(institution());
  await service.criarOferta(offer({instituicaoId:i.id,recurso:'Água 1L'}));
  await service.criarOferta(offer({instituicaoId:i.id,recurso:'Água 1L',unidade:'unidade'}));
  const base = await service.obterBase(); assert.equal(base.revisao,4);
  assert.equal(base.ofertas.filter(o => o.instituicaoId === i.id).length,2);
  base.instituicoes.length = 0; i.nome = 'Mutado';
  assert.equal((await service.obterInstituicao(i.id)).nome,'Demo Nova');
  const detail = await service.obterOferta(base.ofertas.at(-1).id);
  assert.equal(detail.compativel,true); assert.equal(detail.instituicao.id,i.id);
});
test('duplicidade normalizada, referências e instituições inativas não gravam',async () => {
  const {service,storage} = await setup();
  const before = await service.obterBase();
  await rejects(service.criarInstituicao(institution({identificacao:' demo-emp-001 '})),'DUPLICATE');
  await rejects(service.criarOferta(offer({recurso:' AGUA MINERAL '})),'DUPLICATE');
  await rejects(service.criarOferta(offer({instituicaoId:crypto.randomUUID()})),'NOT_FOUND');
  assert.deepEqual(await service.obterBase(),before);
  storage.state.snapshot.instituicoes[0].estado = 'inativa';
  storage.state.snapshot.ofertas.filter(o => o.instituicaoId === before.instituicoes[0].id).forEach(o => {o.estado = 'inativa';});
  await rejects(service.criarOferta(offer()),'INSTITUTION_INACTIVE');
  await rejects(service.criarInstituicao(institution({identificacao:'DEMO-EMP-001'})),'DUPLICATE');
});
test('consultas usam defaults, AND, acentos, igualdade municipal e modos exclusivos',async () => {
  const {service,storage} = await setup();
  assert.equal((await service.consultarOfertas()).total,2);
  assert.equal((await service.consultarOfertas({texto:'agua',uf:'RS',municipio:'cidade alfa',categoria:'agua'})).total,1);
  assert.equal((await service.consultarOfertas({municipio:'Cidade'})).total,0);
  assert.equal((await service.consultarOfertas({situacao:'indisponiveis',categoria:'agua'})).total,1);
  assert.equal((await service.consultarOfertas({situacao:'todas',categoria:'agua'})).total,2);
  assert.equal((await service.listarInstituicoes({texto:'instituicao'})).length,2);
  assert.equal((await service.consultarOfertas({texto:'alfa@example.org'})).total,0);
  storage.state.snapshot.ofertas[0].estado = 'inativa';
  assert.equal((await service.consultarOfertas({situacao:'inativas'})).total,1);
  assert.equal((await service.consultarOfertas()).total,1);
  for (const filter of [{invalido:'x'},{texto:42},{uf:'ZZ'},{situacao:'ativa'},{municipio:'a'.repeat(81)},{texto:'a'.repeat(121)}]) await rejects(service.consultarOfertas(filter),'FILTER_INVALID');
  await rejects(service.obterOferta(crypto.randomUUID()),'NOT_FOUND');
});
test('conjunto exige UUID/data canônicos e integridade', () => {
  assert.equal(dataCanonica('2026-02-30T12:00:00.000Z'),false);
  assert.equal(dataCanonica('2026-10-01T12:00:00Z'),false);
  for (const mutate of [s => {s.ofertas[0].id = 'invalid';},s => {s.instituicoes[0].identificacao = 'demo-emp-001';},s => {s.ofertas[0].createdAt = '2026-02-30T12:00:00.000Z';},s => {s.instituicoes[0].estado = 'inativa';}]) {
    const s = criarSeed(); mutate(s); assert.throws(() => validarConjunto(s));
  }
});
test('limite inclui envelope UTF-8 formatado e rollback',async () => {
  const {service,storage} = await setup();
  const seed = criarSeed();
  storage.state.snapshot.ofertas = [];
  storage.state.snapshot.instituicoes = Array.from({length:1000},(_,index) => ({...seed.instituicoes[0],id:crypto.randomUUID(),identificacao:`DEMO-${index}`,nome:'á'.repeat(120),municipio:'é'.repeat(80),contato:'é'.repeat(120),observacoes:'á'.repeat(500)}));
  assert.throws(() => validarConjunto({...storage.state.snapshot,instituicoes:[...storage.state.snapshot.instituicoes,seed.instituicoes[1]]}),{code:'LIMIT_EXCEEDED'});
  storage.state.snapshot.instituicoes = [seed.instituicoes[0]];
  storage.state.snapshot.ofertas = Array.from({length:1400},(_,index) => ({...seed.ofertas[0],id:crypto.randomUUID(),recurso:`${index} ${'á'.repeat(110)}`,observacoes:'á'.repeat(500)}));
  assert.throws(() => validarConjunto(storage.state.snapshot),{code:'LIMIT_EXCEEDED'});
  const {service:valid} = await setup();
  await rejects(valid.criarOferta(offer({quantidade:Infinity})),'VALIDATION_ERROR');
  assert.equal((await valid.obterBase()).revisao,1);
});
test('relógio lógico supera data futura anterior',async () => {
  const {service,storage} = await setup();
  storage.state.snapshot.ofertas[0].updatedAt = '2099-01-01T00:00:00.000Z';
  assert.equal((await service.criarInstituicao(institution())).createdAt,'2099-01-01T00:00:00.001Z');
});
test('armazenamento indisponível não tem fallback volátil e corrupção não repõe seed',async () => {
  await rejects(new CadastroService(new IndexedDBStorage('test',null)).inicializar(),'STORAGE_UNAVAILABLE');
  const storage = new MemoryStorage(); storage.state.meta = {chave:'meta',inicializada:true,revisao:1};
  await rejects(new CadastroService(storage).inicializar(),'STORAGE_ERROR');
  assert.equal(storage.state.snapshot,undefined);
});

async function token(service,item,confirmed = false) {
  return {expectedRevision:(await service.obterBase()).revisao,expectedUpdatedAt:item.updatedAt,...(confirmed ? {confirmacao:true} : {})};
}
const editInstitution = item => Object.fromEntries(['nome','tipo','identificacao','uf','municipio','contato','observacoes'].map(key => [key,item[key]]));
const editOffer = item => Object.fromEntries(['categoria','recurso','quantidade','unidade','disponibilidade','observacoes'].map(key => [key,item[key]]));
const envelopeSeed = () => ({schemaVersion:1,exportedAt:'2026-10-09T12:00:00.000Z',instituicoes:criarSeed().instituicoes,ofertas:criarSeed().ofertas});

test('edição preserva identidade/vínculo/estado/data de criação e no-op conserva revisão',async () => {
  const {service} = await setup();
  const original = (await service.obterBase()).instituicoes[0];
  const firstToken = await token(service,original);
  const updated = await service.editarInstituicao(original.id,{...editInstitution(original),municipio:'Cidade Nova'},firstToken);
  assert.equal(updated.id,original.id); assert.equal(updated.createdAt,original.createdAt);
  assert.ok(updated.updatedAt > original.updatedAt); assert.equal(updated.estado,original.estado);
  assert.equal((await service.consultarOfertas({municipio:'Cidade Nova'})).total,1);
  const before = await service.obterBase();
  assert.deepEqual(await service.editarInstituicao(updated.id,editInstitution(updated),await token(service,updated)),updated);
  assert.deepEqual(await service.obterBase(),before);
  const o = before.ofertas[0];
  await rejects(service.editarOferta(o.id,{...editOffer(o),instituicaoId:original.id},await token(service,o)),'VALIDATION_ERROR');
  await rejects(service.editarInstituicao(updated.id,{...editInstitution(updated),id:original.id},await token(service,updated)),'VALIDATION_ERROR');
  const changedOffer = await service.editarOferta(o.id,{...editOffer(o),quantidade:0,disponibilidade:'indisponivel'},await token(service,o));
  assert.equal(changedOffer.instituicaoId,o.instituicaoId); assert.equal(changedOffer.createdAt,o.createdAt); assert.equal(changedOffer.estado,'ativa');
  assert.equal((await service.obterOferta(o.id)).compativel,false);
});

test('tokens obrigatórios e revisão detectam alteração independente e antes de no-op',async () => {
  const {service} = await setup();
  const i = (await service.obterBase()).instituicoes[0];
  const stale = await token(service,i);
  await rejects(service.editarInstituicao(i.id,editInstitution(i)),'CONFLICT');
  await rejects(service.editarInstituicao(i.id,editInstitution(i),{expectedUpdatedAt:i.updatedAt}),'CONFLICT');
  await rejects(service.editarInstituicao(i.id,editInstitution(i),{expectedRevision:1}),'CONFLICT');
  await service.criarInstituicao(institution());
  await rejects(service.editarInstituicao(i.id,editInstitution(i),stale),'CONFLICT');
  await rejects(service.definirEstadoInstituicao(i.id,'ativa',{...stale,confirmacao:true}),'CONFLICT');
  const before = await service.obterBase();
  await rejects(service.definirEstadoInstituicao(i.id,'inativa',await token(service,i)),'CONFIRMATION_REQUIRED');
  await rejects(service.editarInstituicao(crypto.randomUUID(),editInstitution(i),await token(service,i)),'NOT_FOUND');
  assert.deepEqual(await service.obterBase(),before);
});

test('desativação cascata atômica, timestamps iguais e reativação individual',async () => {
  const {service} = await setup();
  const before = await service.obterBase();
  const i = before.instituicoes[0], offer0 = before.ofertas[0], offer1 = before.ofertas[1];
  const alreadyInactive = await service.definirEstadoOferta(offer1.id,'inativa',await token(service,offer1,true));
  const inactive = await service.definirEstadoInstituicao(i.id,'inativa',await token(service,i,true));
  let base = await service.obterBase();
  assert.equal(base.revisao,3);
  assert.equal(base.ofertas[0].estado,'inativa'); assert.equal(base.ofertas[1].estado,'inativa');
  assert.equal(base.ofertas[0].updatedAt,inactive.updatedAt);
  assert.equal(base.ofertas[1].updatedAt,alreadyInactive.updatedAt);
  assert.equal(base.ofertas[0].quantidade,offer0.quantidade); assert.equal(base.ofertas[0].disponibilidade,offer0.disponibilidade);
  assert.equal((await service.consultarOfertas()).total,1);
  assert.equal((await service.consultarOfertas({situacao:'inativas'})).total,2);
  await rejects(service.editarOferta(offer0.id,editOffer(offer0),await token(service,base.ofertas[0])),'INSTITUTION_INACTIVE');
  await rejects(service.definirEstadoOferta(offer0.id,'ativa',await token(service,base.ofertas[0],true)),'INSTITUTION_INACTIVE');
  await service.definirEstadoInstituicao(i.id,'inativa',await token(service,inactive,true));
  assert.deepEqual(await service.obterBase(),base);
  const active = await service.definirEstadoInstituicao(i.id,'ativa',await token(service,inactive,true));
  base = await service.obterBase(); assert.ok(base.ofertas.every(o => o.instituicaoId !== i.id || o.estado === 'inativa'));
  const reactivated = await service.definirEstadoOferta(offer0.id,'ativa',await token(service,base.ofertas[0],true));
  assert.equal(reactivated.disponibilidade,offer0.disponibilidade); assert.equal((await service.obterOferta(offer0.id)).compativel,true);
  assert.ok(active.updatedAt > inactive.updatedAt);
});

test('edição duplicada e quantidade zero disponível são rejeitadas sem gravação',async () => {
  const {service} = await setup();
  const before = await service.obterBase();
  const i = before.instituicoes[0], o = before.ofertas[0], other = before.ofertas[1];
  await rejects(service.editarInstituicao(i.id,{...editInstitution(i),identificacao:before.instituicoes[1].identificacao},await token(service,i)),'DUPLICATE');
  await rejects(service.editarOferta(o.id,{...editOffer(other),unidade:other.unidade},await token(service,o)),'DUPLICATE');
  await rejects(service.editarOferta(o.id,{...editOffer(o),quantidade:0},await token(service,o)),'VALIDATION_ERROR');
  assert.deepEqual(await service.obterBase(),before);
});

test('export/import roundtrip preserva dados, revisão muda e opcionais ausentes são completados',async () => {
  const {service} = await setup();
  const before = await service.obterBase();
  const text = await service.exportarBase(), envelope = JSON.parse(text);
  assert.deepEqual(Object.keys(envelope),['schemaVersion','exportedAt','instituicoes','ofertas']);
  assert.deepEqual(await service.validarImportacao(text),{schemaVersion:1,totalInstituicoes:2,totalOfertas:3});
  assert.deepEqual(await service.obterBase(),before);
  await service.importarBase(text,{confirmacao:true,expectedRevision:before.revisao});
  const after = await service.obterBase();
  assert.equal(after.revisao,before.revisao+1);
  assert.deepEqual(after.instituicoes,before.instituicoes); assert.deepEqual(after.ofertas,before.ofertas);
  await rejects(service.editarInstituicao(before.instituicoes[0].id,editInstitution(before.instituicoes[0]),{expectedUpdatedAt:before.instituicoes[0].updatedAt,expectedRevision:before.revisao}),'CONFLICT');
  delete envelope.instituicoes[0].contato; delete envelope.instituicoes[0].observacoes; delete envelope.ofertas[0].observacoes;
  await service.importarBase(JSON.stringify(envelope),{confirmacao:true,expectedRevision:after.revisao});
  assert.equal((await service.obterBase()).instituicoes[0].contato,'');
  assert.equal((await service.obterBase()).ofertas[0].observacoes,'');
});

test('importação vazia persiste sem seed; restauração exige confirmação/revisão e invalida tokens',async () => {
  const {service} = await setup();
  const empty = JSON.stringify({...envelopeSeed(),instituicoes:[],ofertas:[]});
  await rejects(service.importarBase(empty,{expectedRevision:1}),'CONFIRMATION_REQUIRED');
  await rejects(service.importarBase(empty,{confirmacao:true,expectedRevision:2}),'CONFLICT');
  await service.importarBase(empty,{confirmacao:true,expectedRevision:1});
  await service.inicializar();
  assert.equal((await service.obterBase()).ofertas.length,0);
  await rejects(service.restaurarDemonstracao({expectedRevision:2}),'CONFIRMATION_REQUIRED');
  await rejects(service.restaurarDemonstracao({confirmacao:true,expectedRevision:1}),'CONFLICT');
  const restored = await service.restaurarDemonstracao({confirmacao:true,expectedRevision:2});
  assert.deepEqual(restored,{revisao:3,totalInstituicoes:2,totalOfertas:3});
  await service.restaurarDemonstracao({confirmacao:true,expectedRevision:3});
  assert.equal((await service.obterBase()).revisao,4);
});

test('JSON inválido rejeitado integralmente com caminhos de campos e limite bruto',async () => {
  const {service} = await setup();
  const before = await service.obterBase();
  const cases = [
    [e => {e.extra = true;},'extra'],
    [e => {e.ofertas[0].quantidade = '10';},'ofertas[0].quantidade'],
    [e => {e.ofertas[0].quantidade = 0;},'ofertas[0].quantidade'],
    [e => {e.ofertas[0].instituicaoId = crypto.randomUUID();},'ofertas[0].instituicaoId'],
    [e => {e.instituicoes[0].estado = 'inativa';},'ofertas[0].estado'],
    [e => {e.instituicoes[1].identificacao = e.instituicoes[0].identificacao;},'instituicoes[1].identificacao'],
    [e => {e.ofertas[1] = {...e.ofertas[0],id:crypto.randomUUID()};},'ofertas[1].recurso'],
    [e => {e.instituicoes[0].nome = ' Nome com espaço ';},'instituicoes[0].nome'],
    [e => {e.instituicoes[0].identificacao = 'demo-emp-001';},'instituicoes[0].identificacao'],
    [e => {e.instituicoes[0].uf = 'rs';},'instituicoes[0].uf'],
    [e => {e.ofertas[0].id = e.ofertas[0].id.toUpperCase().replace(/^2/,'A');},'ofertas[0].id'],
    [e => {e.ofertas[0].updatedAt = '2026-02-30T12:00:00.000Z';},'ofertas[0].updatedAt'],
    [e => {e.exportedAt = 'bad';},'exportedAt'],
    [e => {e.ofertas[0].extra = true;},'ofertas[0].extra'],
  ];
  for (const [mutate,path] of cases) {
    const envelope = envelopeSeed(); mutate(envelope); const text = JSON.stringify(envelope);
    await assert.rejects(service.validarImportacao(text),error => error.code === 'IMPORT_INVALID' && Object.hasOwn(error.fields,path),path);
    await rejects(service.importarBase(text,{confirmacao:true,expectedRevision:1}),'IMPORT_INVALID');
  }
  await rejects(service.validarImportacao('{'),'IMPORT_INVALID');
  await rejects(service.validarImportacao(JSON.stringify({...envelopeSeed(),schemaVersion:2})),'VERSION_UNSUPPORTED');
  await rejects(service.validarImportacao(' '.repeat(2097153)),'LIMIT_EXCEEDED');
  assert.deepEqual(await service.obterBase(),before);
});

test('JSON compacto pode exceder limite após formatação; nenhuma substituição',async () => {
  const {service} = await setup();
  const envelope = envelopeSeed(); envelope.ofertas = [];
  const template = envelope.instituicoes[0];
  envelope.instituicoes = Array.from({length:1000},(_,index) => ({...template,id:crypto.randomUUID(),identificacao:`DEMO-${index}`,nome:'a'.repeat(120),municipio:'b'.repeat(80),contato:'c'.repeat(120),observacoes:'d'.repeat(500)}));
  const offerTemplate = criarSeed().ofertas[0];
  envelope.ofertas = Array.from({length:1100},(_,index) => ({...offerTemplate,id:crypto.randomUUID(),instituicaoId:envelope.instituicoes[0].id,recurso:`Item ${index}`,observacoes:'e'.repeat(500)}));
  const compact = JSON.stringify(envelope);
  assert.ok(new TextEncoder().encode(compact).length < 2097152);
  assert.ok(new TextEncoder().encode(JSON.stringify(envelope,null,2)).length > 2097152);
  await rejects(service.importarBase(compact,{confirmacao:true,expectedRevision:1}),'LIMIT_EXCEEDED');
  assert.equal((await service.obterBase()).revisao,1);
});

test('import rejeita IDs array sem coerção para string',async()=>{const {service}=await setup();for(const field of ['instituicoes','ofertas']){const doc=JSON.parse(await service.exportarBase());doc[field][0].id=[doc[field][0].id];await rejects(service.validarImportacao(JSON.stringify(doc)),'IMPORT_INVALID');}});
