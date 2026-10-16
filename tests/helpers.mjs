export async function browserRuntime(){if(process.env.PLAYWRIGHT_MODULE)return import(process.env.PLAYWRIGHT_MODULE);return import('playwright');}
export const baseURL=process.env.APP_URL||'http://127.0.0.1:4175/arquitetura_convergentes/';
