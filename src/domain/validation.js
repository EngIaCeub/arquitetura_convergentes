import { AppError } from './errors.js';

export const UFS = 'AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO'.split(' ');
export const TIPOS = ['empresa', 'organizacao', 'orgao_publico', 'coletivo'];
export const UNIDADES = {
  alimentacao: ['unidade','kit','kg','litro'], agua: ['unidade','litro'],
  higiene_limpeza: ['unidade','kit','kg','litro'], vestuario: ['unidade','kit'],
  abrigo: ['unidade','kit'], equipamentos: ['unidade'], transporte: ['unidade'], outros: ['unidade','kit','kg','litro'],
};
export const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
export const clone = value => structuredClone(value);
export const chaveBusca = value => value.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().trim().replace(/\s+/gu, ' ');
export const comparar = (a,b) => a < b ? -1 : a > b ? 1 : 0;
export function invalid(field, message = 'Campo inválido.', code = 'VALIDATION_ERROR') {
  throw new AppError(code, code === 'FILTER_INVALID' ? 'Filtro inválido.' : 'Verifique os campos informados.', { [field]: message });
}
export function object(value, allowed, code = 'VALIDATION_ERROR') {
  if (!value || typeof value !== 'object' || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype) invalid('dados', 'Objeto inválido.', code);
  for (const field of Object.keys(value)) if (!allowed.includes(field)) invalid(field, 'Campo desconhecido.', code);
}
export function texto(value, field, min, max, { optional = false, canonical = false, upper = false, code = 'VALIDATION_ERROR' } = {}) {
  if (value === undefined && optional) return '';
  if (typeof value !== 'string') invalid(field, 'Informe texto.', code);
  if (/[\p{Cc}\p{Cf}]/u.test(value.replace(/\s/gu,''))) invalid(field, 'Caracteres de controle não são permitidos.', code);
  let result = value.normalize('NFKC').trim().replace(/\s+/gu, ' ');
  if (upper) result = result.toUpperCase();
  if (result.length < min || result.length > max || (canonical && result !== value)) invalid(field, `Texto deve conter ${min} a ${max} caracteres normalizados.`, code);
  return result;
}
function enumValue(value, values, field) {
  if (!values.includes(value)) invalid(field, 'Selecione uma opção válida.');
  return value;
}
const institutionFields = ['nome','tipo','identificacao','uf','municipio','contato','observacoes'];
const offerFields = ['instituicaoId','categoria','recurso','quantidade','unidade','disponibilidade','observacoes'];
const generated = ['id','estado','createdAt','updatedAt'];
export function validarInstituicao(dados, canonical = false, entity = false) {
  object(dados, [...institutionFields, ...(entity ? generated : [])]);
  return {
    nome: texto(dados.nome,'nome',2,120,{canonical}),
    tipo: enumValue(dados.tipo,TIPOS,'tipo'),
    identificacao: texto(dados.identificacao,'identificacao',2,40,{canonical,upper:true}),
    uf: enumValue(texto(dados.uf,'uf',2,2,{canonical,upper:true}),UFS,'uf'),
    municipio: texto(dados.municipio,'municipio',2,80,{canonical}),
    contato: texto(dados.contato,'contato',0,120,{canonical,optional:true}),
    observacoes: texto(dados.observacoes,'observacoes',0,500,{canonical,optional:true}),
  };
}
export function validarOferta(dados, canonical = false, entity = false) {
  object(dados, [...offerFields, ...(entity ? generated : [])]);
  if (typeof dados.instituicaoId !== 'string' || !UUID.test(dados.instituicaoId)) invalid('instituicaoId','Identificador inválido.');
  enumValue(dados.categoria,Object.keys(UNIDADES),'categoria');
  enumValue(dados.unidade,UNIDADES[dados.categoria],'unidade');
  enumValue(dados.disponibilidade,['disponivel','indisponivel'],'disponibilidade');
  if (!Number.isInteger(dados.quantidade) || dados.quantidade < 0 || dados.quantidade > 1000000 || (dados.disponibilidade === 'disponivel' && dados.quantidade < 1)) invalid('quantidade','Informe quantidade inteira válida; disponível exige ao menos 1.');
  return {
    instituicaoId: dados.instituicaoId, categoria: dados.categoria,
    recurso: texto(dados.recurso,'recurso',2,120,{canonical}), quantidade: dados.quantidade,
    unidade: dados.unidade, disponibilidade: dados.disponibilidade,
    observacoes: texto(dados.observacoes,'observacoes',0,500,{canonical,optional:true}),
  };
}
export function dataCanonica(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) return false;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) && date.toISOString() === value;
}
export function validarGerados(value) {
  if (typeof value.id !== 'string' || !UUID.test(value.id)) invalid('id','UUID inválido.');
  enumValue(value.estado,['ativa','inativa'],'estado');
  if (!dataCanonica(value.createdAt) || !dataCanonica(value.updatedAt) || value.updatedAt < value.createdAt) invalid('updatedAt','Datas inválidas.');
}
export const chaveOferta = offer => JSON.stringify([offer.instituicaoId,offer.categoria,chaveBusca(offer.recurso),offer.unidade]);
export function validarConjunto(snapshot) {
  object(snapshot,['chave','instituicoes','ofertas']);
  if (snapshot.chave !== 'snapshot' || !Array.isArray(snapshot.instituicoes) || !Array.isArray(snapshot.ofertas)) invalid('base','Base inválida.');
  if (snapshot.instituicoes.length > 1000 || snapshot.ofertas.length > 5000) throw new AppError('LIMIT_EXCEEDED','Limite de registros excedido.');
  const institutions = new Map(), identities = new Set(), offers = new Set(), combinations = new Set();
  for (const item of snapshot.instituicoes) {
    validarInstituicao(item,true,true); validarGerados(item);
    if (institutions.has(item.id) || identities.has(item.identificacao)) throw new AppError('DUPLICATE','Já existe instituição com esta identificação, inclusive entre inativas.',{identificacao:'Identificação duplicada.'});
    institutions.set(item.id,item); identities.add(item.identificacao);
  }
  for (const item of snapshot.ofertas) {
    validarOferta(item,true,true); validarGerados(item);
    const institution = institutions.get(item.instituicaoId);
    if (!institution) throw new AppError('NOT_FOUND','Instituição não encontrada.');
    if (institution.estado === 'inativa' && item.estado === 'ativa') throw new AppError('INSTITUTION_INACTIVE','A instituição está inativa.');
    const key = chaveOferta(item);
    if (offers.has(item.id) || combinations.has(key)) throw new AppError('DUPLICATE','Esta instituição já possui oferta deste recurso e unidade; edite ou reative a existente.',{recurso:'Oferta duplicada.'});
    offers.add(item.id); combinations.add(key);
  }
  const envelope = { schemaVersion:1, exportedAt:'2000-01-01T00:00:00.000Z', instituicoes:snapshot.instituicoes, ofertas:snapshot.ofertas };
  if (new TextEncoder().encode(JSON.stringify(envelope,null,2)).length > 2097152) throw new AppError('LIMIT_EXCEEDED','Base excede o limite de 2 MiB.');
  return snapshot;
}
export function proximoInstante(snapshot) {
  const largest = [...snapshot.instituicoes,...snapshot.ofertas].reduce((max,item) => Math.max(max,Date.parse(item.updatedAt)),0);
  return new Date(Math.max(Date.now(),largest + 1)).toISOString();
}
export function validarFiltros(filtros = {}, institutions = false) {
  const code = 'FILTER_INVALID';
  object(filtros,institutions ? ['texto','estado'] : ['texto','municipio','uf','categoria','situacao'],code);
  const out = {};
  for (const field of Object.keys(filtros)) {
    const value = texto(filtros[field],field,0,field === 'municipio' ? 80 : 120,{code});
    if (value) out[field] = value;
  }
  if (institutions) {
    out.estado ??= 'todas';
    if (!['todas','ativa','inativa'].includes(out.estado)) invalid('estado','Estado inválido.',code);
  } else {
    out.situacao ??= 'compativeis';
    if (!['compativeis','indisponiveis','inativas','todas'].includes(out.situacao)) invalid('situacao','Situação inválida.',code);
    if (out.uf && !UFS.includes(out.uf)) invalid('uf','UF inválida.',code);
    if (out.categoria && !Object.hasOwn(UNIDADES,out.categoria)) invalid('categoria','Categoria inválida.',code);
  }
  return out;
}
