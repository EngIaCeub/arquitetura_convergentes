export class AppError extends Error {
  constructor(code, message, fields) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    if (fields) this.fields = fields;
  }
}

export function storageError(error) {
  if (error instanceof AppError) return error;
  const name = error?.name;
  if (name === 'QuotaExceededError') return new AppError('STORAGE_QUOTA', 'Armazenamento sem espaço. Preserve os dados e tente exportar a base.');
  if (name === 'VersionError') return new AppError('VERSION_UNSUPPORTED', 'Versão do banco não suportada.');
  if (name === 'SecurityError' || name === 'NotAllowedError') return new AppError('STORAGE_UNAVAILABLE', 'Armazenamento indisponível neste navegador.');
  return new AppError('STORAGE_ERROR', 'Falha no armazenamento. A operação não foi salva.');
}
