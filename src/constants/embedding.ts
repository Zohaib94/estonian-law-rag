// Multilingual, so a question asked in Estonian still finds the English text.
export const EMBEDDING_MODEL = 'Xenova/multilingual-e5-small';

export const EMBEDDING_DIMENSIONS = 384;

export const EMBEDDING_BATCH_SIZE = 32;

// e5 models are trained with these prefixes; leaving them out lowers retrieval quality.
export const QUERY_PREFIX = 'query: ';

export const PASSAGE_PREFIX = 'passage: ';
