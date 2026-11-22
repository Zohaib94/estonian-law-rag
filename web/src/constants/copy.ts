export const COPY = {
  title: 'Estonian law assistant',
  intro:
    'Ask a question about the Employment Contracts Act (TLS) or the Constitution (PS). The app finds the most relevant sections, and an AI model answers from those sections only, citing each one it used.',
  questionLabel: 'Your question',
  samplesLabel: 'Try:',
  submit: 'Ask',
  submitting: 'Searching the act…',
  answerTitle: 'Answer',
  basedOn: 'Based on',
  notCovered: 'Not covered by these acts',
  noAnswer:
    'No written answer. Either no Gemini API key is set, or the model could not give an answer backed by the sections below. The sections are still the most relevant parts of the acts.',
  sectionsTitle: 'Sections found',
  sectionsIntro: 'The 5 sections given to the model, best match first. Each shows which search found it.',
  cited: 'Cited',
  keywordRank: (rank: number) => `keyword #${rank}`,
  vectorRank: (rank: number) => `vector #${rank}`,
  showText: 'Show text',
  disclaimer: 'Legal information, not legal advice. Source: the official English translations on Riigi Teataja:',
  genericError: 'Could not get an answer. Check that the server is running and try again.',
};
