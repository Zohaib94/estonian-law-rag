export interface Act {
  code: string;
  name: string;

  sourceUrl: string;

  pageUrl: string;
}

export interface LawSection {
  actCode: string;

  sectionNr: string;

  position: number;
  title: string;
  text: string;
}
