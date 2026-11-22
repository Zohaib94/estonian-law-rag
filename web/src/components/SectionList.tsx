import { COPY } from '../constants/copy.ts';
import type { SectionListProps } from '../types/components.ts';

export function SectionList({ sections, citations }: SectionListProps) {
  return (
    <section className="section-list">
      <h2>{COPY.sectionsTitle}</h2>
      <p className="muted">{COPY.sectionsIntro}</p>

      <ol>
        {sections.map((section) => (
          <li key={`${section.actCode}-${section.sectionNr}`} id={`section-${section.sectionNr}`}>
            <h3>
              § {section.sectionNr}. {section.title}
            </h3>

            <div className="badges">
              {citations.includes(section.sectionNr) && <span className="badge badge-cited">{COPY.cited}</span>}
              {section.keywordRank !== null && <span className="badge">{COPY.keywordRank(section.keywordRank)}</span>}
              {section.vectorRank !== null && <span className="badge">{COPY.vectorRank(section.vectorRank)}</span>}
            </div>

            <details>
              <summary>{COPY.showText}</summary>
              <p className="section-text">{section.text}</p>
            </details>
          </li>
        ))}
      </ol>
    </section>
  );
}
