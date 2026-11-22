export interface Act {
  code: string;
  name: string;
  // Where the import script downloads the act's HTML from.
  sourceUrl: string;
  // The human-readable page, linked from the UI.
  pageUrl: string;
}

// One § of an act: the unit that is stored, embedded, retrieved and cited.
export interface LawSection {
  actCode: string;
  // As printed in the act, e.g. "97" or "10¹".
  sectionNr: string;
  // Order within the act.
  position: number;
  title: string;
  text: string;
}
