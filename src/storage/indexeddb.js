import { AppError, storageError } from '../domain/errors.js';
import { clone, validarConjunto } from '../domain/validation.js';

export function validarEstado(state, allowEmpty = false) {
  if (allowEmpty && state.snapshot === undefined && state.meta === undefined) return;
  if (!state.snapshot || !state.meta || state.meta.chave !== 'meta' || state.meta.inicializada !== true || !Number.isSafeInteger(state.meta.revisao) || state.meta.revisao < 1 || Object.keys(state.meta).some(key => !['chave','inicializada','revisao'].includes(key))) throw new AppError('STORAGE_ERROR','Base local inconsistente; nenhum dado foi substituído.');
  try { validarConjunto(state.snapshot); } catch { throw new AppError('STORAGE_ERROR','Base local inconsistente; nenhum dado foi substituído.'); }
}

export class IndexedDBStorage {
  constructor(dbName = 'cadastro-doadores-institucionais', indexedDB = globalThis.indexedDB) {
    this.dbName = dbName;
    this.indexedDB = indexedDB;
    this.connection = null;
    this.opening = null;
  }
  async abrir() {
    if (this.connection) return this.connection;
    if (this.opening) return this.opening;
    if (!this.indexedDB) throw new AppError('STORAGE_UNAVAILABLE','IndexedDB indisponível neste navegador.');
    this.opening = new Promise((resolve,reject) => {
      let request;
      let blocked = false;
      try { request = this.indexedDB.open(this.dbName,1); } catch (error) { reject(storageError(error)); return; }
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains('estado')) db.createObjectStore('estado',{keyPath:'chave'});
      };
      request.onblocked = () => { blocked = true; reject(new AppError('STORAGE_BLOCKED','Feche ou recarregue outras abas deste aplicativo.')); };
      request.onerror = () => reject(storageError(request.error));
      request.onsuccess = () => {
        const db = request.result;
        if (blocked) { db.close(); return; }
        this.connection = db;
        db.onversionchange = () => { db.close(); this.connection = null; };
        resolve(db);
      };
    });
    try { return await this.opening; } finally { this.opening = null; }
  }
  async executar(mode, transformar) {
    const db = await this.abrir();
    return new Promise((resolve,reject) => {
      let transaction, result, failure;
      try { transaction = db.transaction('estado',mode); } catch (error) { reject(storageError(error)); return; }
      transaction.oncomplete = () => resolve(clone(result));
      transaction.onabort = () => reject(failure ?? storageError(transaction.error));
      transaction.onerror = () => { failure ??= storageError(transaction.error); };
      const store = transaction.objectStore('estado');
      const snapshotRequest = store.get('snapshot');
      const metaRequest = store.get('meta');
      metaRequest.onsuccess = () => {
        try {
          const state = {snapshot:snapshotRequest.result,meta:metaRequest.result};
          validarEstado(state,mode === 'readwrite');
          if (mode === 'readonly') { result = state; return; }
          const next = transformar(clone(state));
          if (next && typeof next.then === 'function') throw new AppError('STORAGE_ERROR','Transformação de armazenamento deve ser síncrona.');
          validarEstado(next);
          if (JSON.stringify(next) !== JSON.stringify(state)) {
            if (next.meta.revisao !== (state.meta?.revisao ?? 0) + 1) throw new AppError('STORAGE_ERROR','Revisão inválida.');
            store.put(next.snapshot); store.put(next.meta);
          }
          result = next;
        } catch (error) { failure = storageError(error); transaction.abort(); }
      };
    });
  }
  lerEstado() { return this.executar('readonly'); }
  mutarEstado(transformar) { return this.executar('readwrite',transformar); }
  fechar() { this.connection?.close(); this.connection = null; }
}
