import { AppError } from './errors.js';
import { clone, chaveBusca, comparar, validarInstituicao, validarOferta, validarConjunto, validarFiltros, proximoInstante, object, invalid, dataCanonica, validarGerados, chaveOferta } from './validation.js';
import { criarSeed } from '../data/seed.js';
import { IndexedDBStorage } from '../storage/indexeddb.js';
export { AppError } from './errors.js';
const find = (items,id,label) => {
  const item = items.find(item => item.id === id);
  if (!item) throw new AppError('NOT_FOUND',`${label} não encontrada.`);
  return item;
};
export const compativel = (oferta,instituicao) => instituicao.estado === 'ativa' && oferta.estado === 'ativa' && oferta.disponibilidade === 'disponivel' && oferta.quantidade > 0;

function options(value, confirmation = false, timestamp = true) {
  object(value ?? {},[...(confirmation ? ['confirmacao'] : []),'expectedRevision',...(timestamp ? ['expectedUpdatedAt'] : [])]);
  const o = value ?? {};
  if (o.expectedRevision !== undefined && (!Number.isSafeInteger(o.expectedRevision) || o.expectedRevision < 1)) invalid('expectedRevision','Revisão inválida.');
  if (timestamp && o.expectedUpdatedAt !== undefined && !dataCanonica(o.expectedUpdatedAt)) invalid('expectedUpdatedAt','Data inválida.');
  if (confirmation && o.confirmacao !== undefined && typeof o.confirmacao !== 'boolean') invalid('confirmacao','Confirmação inválida.');
  return o;
}
function tokens(state,item,o,confirmation = false) {
  if (confirmation && o.confirmacao !== true) throw new AppError('CONFIRMATION_REQUIRED','Confirme a operação antes de continuar.');
  if (o.expectedRevision !== state.meta.revisao || (item && o.expectedUpdatedAt !== item.updatedAt)) throw new AppError('CONFLICT','A base mudou. Recarregue e revise os dados antes de continuar.');
}
function parseImport(text) {
  if (typeof text !== 'string') throw new AppError('IMPORT_INVALID','Informe um arquivo JSON em texto.',{arquivo:'Texto obrigatório.'});
  if (new TextEncoder().encode(text).length > 2097152) throw new AppError('LIMIT_EXCEEDED','Arquivo excede 2 MiB.');
  let envelope;
  try { envelope = JSON.parse(text); } catch { throw new AppError('IMPORT_INVALID','Arquivo JSON inválido.',{arquivo:'JSON malformado.'}); }
  function at(path,operation) {
    try { return operation(); } catch (error) {
      if (['LIMIT_EXCEEDED','VERSION_UNSUPPORTED'].includes(error.code)) throw error;
      const fields = error.fields ?? {'':error.message};
      throw new AppError('IMPORT_INVALID','Arquivo inválido; nenhuma alteração realizada.',Object.fromEntries(Object.entries(fields).map(([key,message]) => [path && key ? `${path}.${key}` : path || key,message])));
    }
  }
  at('',() => {
    object(envelope,['schemaVersion','exportedAt','instituicoes','ofertas']);
    if (envelope.schemaVersion !== 1) {
      if (Number.isInteger(envelope.schemaVersion)) throw new AppError('VERSION_UNSUPPORTED','Versão JSON não suportada.');
      invalid('schemaVersion','Versão deve ser o número inteiro 1.');
    }
    if (!dataCanonica(envelope.exportedAt)) invalid('exportedAt','Data UTC inválida.');
    if (!Array.isArray(envelope.instituicoes)) invalid('instituicoes','Lista obrigatória.');
    if (!Array.isArray(envelope.ofertas)) invalid('ofertas','Lista obrigatória.');
    if (envelope.instituicoes.length > 1000 || envelope.ofertas.length > 5000) throw new AppError('LIMIT_EXCEEDED','Limite de registros excedido.');
  });
  const institutions = new Map(), identities = new Set(), offerIds = new Set(), combinations = new Set();
  const instituicoes = envelope.instituicoes.map((entity,index) => at(`instituicoes[${index}]`,() => {
    const fields = validarInstituicao(entity,true,true); validarGerados(entity);
    if (institutions.has(entity.id)) invalid('id','UUID duplicado.');
    if (identities.has(fields.identificacao)) invalid('identificacao','Identificação duplicada.');
    const item = {...entity,...fields};
    institutions.set(item.id,item); identities.add(item.identificacao);
    return item;
  }));
  const ofertas = envelope.ofertas.map((entity,index) => at(`ofertas[${index}]`,() => {
    const fields = validarOferta(entity,true,true); validarGerados(entity);
    if (offerIds.has(entity.id)) invalid('id','UUID duplicado.');
    const institution = institutions.get(entity.instituicaoId);
    if (!institution) invalid('instituicaoId','Instituição ausente no arquivo.');
    if (institution.estado === 'inativa' && entity.estado === 'ativa') invalid('estado','Oferta ativa sob instituição inativa.');
    const key = chaveOferta(entity);
    if (combinations.has(key)) invalid('recurso','Oferta duplicada.');
    offerIds.add(entity.id); combinations.add(key);
    return {...entity,...fields};
  }));
  return at('',() => validarConjunto({chave:'snapshot',instituicoes,ofertas}));
}

export class CadastroService {
  constructor(storage = new IndexedDBStorage()) { this.storage = storage; }
  async inicializar() {
    const state = await this.storage.mutarEstado(state => {
      if (state.meta || state.snapshot) return state;
      return {snapshot:validarConjunto(criarSeed()),meta:{chave:'meta',inicializada:true,revisao:1}};
    });
    return {revisao:state.meta.revisao,inicializada:true};
  }
  async obterBase() {
    const {snapshot,meta} = await this.storage.lerEstado();
    return clone({revisao:meta.revisao,instituicoes:snapshot.instituicoes,ofertas:snapshot.ofertas});
  }
  async listarInstituicoes(filtros = {}) {
    const f = validarFiltros(filtros,true);
    const {instituicoes} = await this.obterBase();
    return instituicoes.filter(item => (!f.texto || chaveBusca(item.nome).includes(chaveBusca(f.texto))) && (f.estado === 'todas' || item.estado === f.estado)).sort((a,b) => comparar(chaveBusca(a.nome),chaveBusca(b.nome)) || comparar(a.id,b.id));
  }
  async obterInstituicao(id) { return find((await this.obterBase()).instituicoes,id,'Instituição'); }
  async obterOferta(id) {
    const base = await this.obterBase();
    const oferta = find(base.ofertas,id,'Oferta');
    const instituicao = find(base.instituicoes,oferta.instituicaoId,'Instituição');
    return {oferta,instituicao,compativel:compativel(oferta,instituicao)};
  }
  async consultarOfertas(filtros = {}) {
    const f = validarFiltros(filtros);
    const base = await this.obterBase();
    const institutions = new Map(base.instituicoes.map(item => [item.id,item]));
    const itens = base.ofertas.map(oferta => {
      const instituicao = institutions.get(oferta.instituicaoId);
      return {oferta,instituicao,compativel:compativel(oferta,instituicao)};
    }).filter(({oferta:o,instituicao:i,compativel:c}) => {
      const situation = f.situacao === 'todas' || (f.situacao === 'compativeis' && c) || (f.situacao === 'inativas' && (i.estado === 'inativa' || o.estado === 'inativa')) || (f.situacao === 'indisponiveis' && i.estado === 'ativa' && o.estado === 'ativa' && o.disponibilidade === 'indisponivel');
      return situation && (!f.texto || chaveBusca(i.nome).includes(chaveBusca(f.texto)) || chaveBusca(o.recurso).includes(chaveBusca(f.texto))) && (!f.municipio || chaveBusca(i.municipio) === chaveBusca(f.municipio)) && (!f.uf || i.uf === f.uf) && (!f.categoria || o.categoria === f.categoria);
    }).sort((a,b) => comparar(chaveBusca(a.oferta.recurso),chaveBusca(b.oferta.recurso)) || comparar(chaveBusca(a.instituicao.nome),chaveBusca(b.instituicao.nome)) || comparar(a.oferta.id,b.oferta.id));
    return {itens,total:itens.length};
  }
  async criarInstituicao(dados) {
    const fields = validarInstituicao(dados);
    return this.criar('instituicoes',fields);
  }
  async criarOferta(dados) {
    const fields = validarOferta(dados);
    return this.criar('ofertas',fields);
  }
  async criar(collection,fields) {
    let created;
    await this.storage.mutarEstado(state => {
      if (collection === 'ofertas') {
        const institution = find(state.snapshot.instituicoes,fields.instituicaoId,'Instituição');
        if (institution.estado !== 'ativa') throw new AppError('INSTITUTION_INACTIVE','Reative a instituição antes de cadastrar uma oferta.');
      }
      const now = proximoInstante(state.snapshot);
      created = {...fields,id:globalThis.crypto.randomUUID(),estado:'ativa',createdAt:now,updatedAt:now};
      state.snapshot[collection].push(created);
      validarConjunto(state.snapshot);
      state.meta.revisao++;
      return state;
    });
    return clone(created);
  }
  async editarInstituicao(id,dados,opcoes) {
    const fields = validarInstituicao(dados);
    return this.editar('instituicoes',id,fields,options(opcoes));
  }
  async editarOferta(id,dados,opcoes) {
    object(dados,['categoria','recurso','quantidade','unidade','disponibilidade','observacoes']);
    const {instituicaoId,...fields} = validarOferta({...dados,instituicaoId:'11111111-1111-4111-8111-111111111111'});
    return this.editar('ofertas',id,fields,options(opcoes));
  }
  async editar(collection,id,fields,o) {
    let updated;
    await this.storage.mutarEstado(state => {
      const item = find(state.snapshot[collection],id,collection === 'ofertas' ? 'Oferta' : 'Instituição');
      tokens(state,item,o);
      if (collection === 'ofertas') this.exigirInstituicaoAtiva(state,item.instituicaoId);
      if (Object.entries(fields).every(([key,value]) => item[key] === value)) { updated = item; return state; }
      updated = {...item,...fields,updatedAt:proximoInstante(state.snapshot)};
      state.snapshot[collection][state.snapshot[collection].indexOf(item)] = updated;
      validarConjunto(state.snapshot); state.meta.revisao++;
      return state;
    });
    return clone(updated);
  }
  exigirInstituicaoAtiva(state,id) {
    const institution = find(state.snapshot.instituicoes,id,'Instituição');
    if (institution.estado !== 'ativa') throw new AppError('INSTITUTION_INACTIVE','Reative a instituição antes de alterar suas ofertas.');
  }
  async definirEstadoInstituicao(id,estado,opcoes) { return this.definirEstado('instituicoes',id,estado,opcoes); }
  async definirEstadoOferta(id,estado,opcoes) { return this.definirEstado('ofertas',id,estado,opcoes); }
  async definirEstado(collection,id,estado,opcoes) {
    if (!['ativa','inativa'].includes(estado)) invalid('estado','Estado inválido.');
    const o = options(opcoes,true);
    let updated;
    await this.storage.mutarEstado(state => {
      const item = find(state.snapshot[collection],id,collection === 'ofertas' ? 'Oferta' : 'Instituição');
      tokens(state,item,o,true);
      if (collection === 'ofertas' && estado === 'ativa') this.exigirInstituicaoAtiva(state,item.instituicaoId);
      if (item.estado === estado) { updated = item; return state; }
      const now = proximoInstante(state.snapshot);
      item.estado = estado; item.updatedAt = now; updated = item;
      if (collection === 'instituicoes' && estado === 'inativa') for (const offer of state.snapshot.ofertas) {
        if (offer.instituicaoId === id && offer.estado !== 'inativa') { offer.estado = 'inativa'; offer.updatedAt = now; }
      }
      validarConjunto(state.snapshot); state.meta.revisao++;
      return state;
    });
    return clone(updated);
  }
  async exportarBase() {
    const base = await this.obterBase();
    return JSON.stringify({schemaVersion:1,exportedAt:new Date().toISOString(),instituicoes:base.instituicoes,ofertas:base.ofertas},null,2);
  }
  async validarImportacao(texto) {
    const snapshot = parseImport(texto);
    return {schemaVersion:1,totalInstituicoes:snapshot.instituicoes.length,totalOfertas:snapshot.ofertas.length};
  }
  async importarBase(texto,opcoes) {
    parseImport(texto);
    const o = options(opcoes,true,false);
    return this.substituir(() => parseImport(texto),o);
  }
  async restaurarDemonstracao(opcoes) { return this.substituir(criarSeed,options(opcoes,true,false)); }
  async substituir(makeSnapshot,o) {
    const state = await this.storage.mutarEstado(state => {
      tokens(state,null,o,true);
      state.snapshot = validarConjunto(makeSnapshot()); state.meta.revisao++;
      return state;
    });
    return {revisao:state.meta.revisao,totalInstituicoes:state.snapshot.instituicoes.length,totalOfertas:state.snapshot.ofertas.length};
  }
}
