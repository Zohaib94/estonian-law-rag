import type { Act } from '../types/law.ts';

// The official English translations from Riigi Teataja; the Estonian text is the legally binding one. Each act
// needs a short code (used in citations such as "TLS § 97") and two URLs: the HTML the import script downloads
// (public-api/api/v1/en/akt/<id>/blob-html) and the page people can read. The <id> names one version of the
// translation. To update an act to a newer version, find its id on riigiteataja.ee and change both URLs, then run
// `npm run import:act -- <code>` and `npm run embed`. To add an act, add an entry here (and golden questions).

// shortcut: pinned to the version in force from 01.10.2026 until 31.12.2026. A newer one has to be looked up by hand.
export const EMPLOYMENT_CONTRACTS_ACT: Act = {
  code: 'TLS',
  name: 'Employment Contracts Act',
  sourceUrl: 'https://www.riigiteataja.ee/public-api/api/v1/en/akt/527102026004/blob-html',
  pageUrl: 'https://www.riigiteataja.ee/en/eli/527102026004/consolide',
};

// Translation published 23.04.2025, in force from 01.03.2026 with no end date.
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
