import { COPY } from '../constants/copy.ts';
import { ACTS } from '../../../src/constants/acts.ts';
import { sectionRef } from '../../../src/services/section-ref.ts';
import { anchorId } from '../services/anchor-id.ts';
import type { SectionListProps } from '../types/components.ts';

export function SectionList({ sections, citations }: SectionListProps) {
  return (
    <section className="section-list">
      <h2>{COPY.sectionsTitle}</h2>
      <p className="muted">{COPY.sectionsIntro}</p>

      <ol>
        {sections.map((section) => (
          <li key={sectionRef(section)} id={anchorId(sectionRef(section))}>
            <h3>
              {sectionRef(section)}.{section.title && ` ${section.title}`}
            </h3>

            <div className="badges">
              <span className="badge">{ACTS[section.actCode]?.name ?? section.actCode}</span>
              {citations.includes(sectionRef(section)) && <span className="badge badge-cited">{COPY.cited}</span>}
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
