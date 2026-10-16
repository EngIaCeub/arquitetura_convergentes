import {CadastroService} from './domain/service.js';
import {IndexedDBStorage} from './storage/indexeddb.js';
import {startUI} from './ui/app.js';
const service=new CadastroService(new IndexedDBStorage());
startUI(service);
