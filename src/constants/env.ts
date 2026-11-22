export const DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://law:law@localhost:5433/law';

export const PORT = Number(process.env.PORT ?? 3001);

export const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

export const MODEL_CACHE_DIR = process.env.MODEL_CACHE_DIR;

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY || undefined;

export const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-flash-latest';
