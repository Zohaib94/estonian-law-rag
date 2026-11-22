import type { Act } from '../types/law.ts';

// shortcut: one act, the official English translation in force from 15.06.2024. The Estonian text is the legally
// binding one. For a newer version, find the latest translation id on riigiteataja.ee and update both URLs.
export const EMPLOYMENT_CONTRACTS_ACT: Act = {
  code: 'TLS',
  name: 'Employment Contracts Act',
  sourceUrl: 'https://www.riigiteataja.ee/public-api/api/v1/en/akt/529052024001/blob-html',
  pageUrl: 'https://www.riigiteataja.ee/en/eli/529052024001/consolide',
};

export const ACTS: Record<string, Act> = {
  [EMPLOYMENT_CONTRACTS_ACT.code]: EMPLOYMENT_CONTRACTS_ACT,
};
