// How many sections keyword search and vector search each return before their lists are fused.
export const CANDIDATES_PER_SEARCH = 20;

// Sections given to the model as context and shown in the UI.
export const SECTIONS_RETRIEVED = 5;

// Reciprocal rank fusion constant: 60 is the value from the original RRF paper and the usual default.
export const RRF_K = 60;
