import { MarketingShell, PageHero } from "./marketing-shell";

export interface LegalSection {
  heading: string;
  paragraphs: string[];
}

export function LegalContent({
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  updatedAt: string;
  intro: string;
  sections: LegalSection[];
}) {
  return (
    <MarketingShell>
      <PageHero eyebrow={eyebrow} title={title} />
      <section className="section max-w-3xl py-16">
        <p className="text-sm text-muted-foreground">Última atualização: {updatedAt}</p>
        <p className="mt-4 leading-relaxed text-foreground">{intro}</p>
        <div className="mt-8 space-y-8">
          {sections.map((s, i) => (
            <div key={s.heading}>
              <h2 className="text-lg font-bold text-foreground">
                {i + 1}. {s.heading}
              </h2>
              <div className="mt-2 space-y-3">
                {s.paragraphs.map((p, j) => (
                  <p key={j} className="leading-relaxed text-foreground">
                    {p}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </MarketingShell>
  );
}
