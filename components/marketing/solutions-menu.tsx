"use client";

import {
  getFeaturedSolutions,
  getSolutionMenuGroups,
} from "@/lib/solution-vitrine";
import {
  MegaMenuColumn,
  MegaMenuCompactItem,
  MegaMenuGrid,
  MegaMenuItem,
  MegaMenuLinks,
  MegaMenuSectionTitle,
  MegaMenuSidebar,
  MegaMenuStory,
} from "@/components/marketing/mega-menu";

export function SolutionsMenuPanel({ onClose }: { onClose?: () => void }) {
  const groups = getSolutionMenuGroups();
  const featured = getFeaturedSolutions();

  const moduleItems = groups.flatMap((group) =>
    group.items.slice(0, 1).map((item) => ({
      ...item,
      groupIcon: group.icon,
      groupDescription: group.description,
    })),
  );

  return (
    <MegaMenuGrid>
      <MegaMenuColumn>
        <div className="space-y-0.5">
          {featured.map((solution) => (
            <MegaMenuItem
              key={solution.slug}
              href={`/solucoes#${solution.slug}`}
              icon={solution.icon}
              title={solution.title}
              description={solution.headline}
              onNavigate={onClose}
            />
          ))}
        </div>
      </MegaMenuColumn>

      <MegaMenuColumn className="md:border-l md:border-border">
        <MegaMenuSectionTitle>Áreas</MegaMenuSectionTitle>
        <div className="space-y-0.5">
          {moduleItems.map((item) => (
            <MegaMenuCompactItem
              key={item.slug}
              href={`/solucoes#${item.slug}`}
              icon={item.icon}
              title={item.title}
              description={item.groupDescription ?? item.headline}
              onNavigate={onClose}
            />
          ))}
          <MegaMenuCompactItem
            href="/solucoes"
            icon="Compass"
            title="Todas as soluções"
            description="Encontre a resposta para o seu desafio."
            onNavigate={onClose}
          />
        </div>
      </MegaMenuColumn>

      <MegaMenuSidebar>
        <MegaMenuStory
          href="/casos"
          title="Restaurante organiza delivery e estoque em um só lugar."
          subtitle="Soluções que resolvem problemas reais do dia a dia."
          onNavigate={onClose}
        />
        <MegaMenuLinks
          title="Saiba mais"
          links={[
            { href: "/solucoes", label: "Ver todas as soluções" },
            { href: "/precos", label: "Planos e preços" },
            { href: "/suporte", label: "Falar com suporte" },
          ]}
          onNavigate={onClose}
        />
      </MegaMenuSidebar>
    </MegaMenuGrid>
  );
}
