import type { Act } from '../types/law.ts';

export const EMPLOYMENT_CONTRACTS_ACT: Act = {
  code: 'TLS',
  name: 'Employment Contracts Act',
  sourceUrl: 'https://www.riigiteataja.ee/public-api/api/v1/en/akt/527102026004/blob-html',
  pageUrl: 'https://www.riigiteataja.ee/en/eli/527102026004/consolide',
};

export const CONSTITUTION: Act = {
  code: 'PS',
  name: 'Constitution of the Republic of Estonia',
  sourceUrl: 'https://www.riigiteataja.ee/public-api/api/v1/en/akt/523042025002/blob-html',
  pageUrl: 'https://www.riigiteataja.ee/en/eli/523042025002/consolide',
};

export const ACTS: Record<string, Act> = {
  [EMPLOYMENT_CONTRACTS_ACT.code]: EMPLOYMENT_CONTRACTS_ACT,
  [CONSTITUTION.code]: CONSTITUTION,
};
