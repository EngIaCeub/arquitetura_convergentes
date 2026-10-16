import {mkdir,cp,readFile,readdir,writeFile,rm,lstat} from 'node:fs/promises';
import path from 'node:path';
const destination=path.resolve('dist');
if(destination!==path.join(process.cwd(),'dist'))throw Error('Destino de build inválido');
try{if((await lstat(destination)).isSymbolicLink())throw Error('dist não pode ser link');}catch(e){if(e.code!=='ENOENT')throw e;}
await rm(destination,{recursive:true,force:true});
await mkdir('dist',{recursive:true});
for(const path of ['index.html','src'])await cp(path,`dist/${path}`,{recursive:true});
await writeFile('dist/.nojekyll','');
const sha=process.env.GITHUB_SHA;
if(sha){if(!/^[a-f0-9]{40}$/.test(sha))throw Error('SHA inválido');await writeFile('dist/build-meta.json',JSON.stringify({sha},null,2));}
async function files(dir){let out=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;out.push(...(e.isDirectory()?await files(p):[p]));}return out;}
const all=await files('dist');
for(const p of all){if(!/\.(html|js|css|svg|json)$/.test(p)&&!p.endsWith('.nojekyll'))throw Error('Arquivo inesperado '+p);const s=await readFile(p,'utf8');if(/(?:C:\\Users|localhost:|127\.0\.0\.1|gh[op]_\w+|https?:\/\/[^" ]+\.js)/.test(s))throw Error('Referência privada/externa '+p);}
console.log('Build estático validado:',all.length,'arquivos');
