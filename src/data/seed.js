const date = '2026-10-01T12:00:00.000Z';
const generated = {estado:'ativa',createdAt:date,updatedAt:date};
export const seed = {
  chave:'snapshot',
  instituicoes:[
    {id:'11111111-1111-4111-8111-111111111111',nome:'Instituição Demo Alfa',tipo:'empresa',identificacao:'DEMO-EMP-001',uf:'RS',municipio:'Cidade Alfa',contato:'alfa@example.org',observacoes:'Registro fictício',...generated},
    {id:'33333333-3333-4333-8333-333333333333',nome:'Instituição Demo Beta',tipo:'coletivo',identificacao:'DEMO-COL-001',uf:'RS',municipio:'Cidade Beta',contato:'beta@example.org',observacoes:'Registro fictício',...generated},
  ],
  ofertas:[
    {id:'22222222-2222-4222-8222-222222222222',instituicaoId:'11111111-1111-4111-8111-111111111111',categoria:'agua',recurso:'Água mineral',quantidade:10,unidade:'litro',disponibilidade:'disponivel',observacoes:'Disponibilidade fictícia',...generated},
    {id:'44444444-4444-4444-8444-444444444444',instituicaoId:'11111111-1111-4111-8111-111111111111',categoria:'agua',recurso:'Galão',quantidade:2,unidade:'unidade',disponibilidade:'indisponivel',observacoes:'Disponibilidade fictícia',...generated},
    {id:'55555555-5555-4555-8555-555555555555',instituicaoId:'33333333-3333-4333-8333-333333333333',categoria:'higiene_limpeza',recurso:'Kit higiene',quantidade:5,unidade:'kit',disponibilidade:'disponivel',observacoes:'Disponibilidade fictícia',...generated},
  ],
};
export const criarSeed = () => structuredClone(seed);
