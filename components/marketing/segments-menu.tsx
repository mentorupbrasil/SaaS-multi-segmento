"use client";

import {
  getFeaturedSegments,
  getMenuSegmentGroups,
} from "@/lib/segment-vitrine";
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

export function SegmentsMenuPanel({ onClose }: { onClose?: () => void }) {
  const groups = getMenuSegmentGroups();
  const featured = getFeaturedSegments().slice(0, 5);

  const categoryItems = groups.flatMap((group) =>
    group.segments.slice(0, 2).map((segment) => ({
      ...segment,
      groupIcon: group.icon,
    })),
  ).slice(0, 4);

  return (
    <MegaMenuGrid>
      <MegaMenuColumn>
        <div className="space-y-0.5">
          {featured.map((segment) => (
            <MegaMenuItem
              key={segment.id}
              href={`/${segment.slug}`}
              icon={segment.icon}
              title={segment.label}
              description={segment.tagline}
              onNavigate={onClose}
            />
          ))}
        </div>
      </MegaMenuColumn>

      <MegaMenuColumn className="md:border-l md:border-border">
        <MegaMenuSectionTitle>Categorias</MegaMenuSectionTitle>
        <div className="space-y-0.5">
          {categoryItems.map((segment) => (
            <MegaMenuCompactItem
              key={segment.id}
              href={`/${segment.slug}`}
              icon={segment.icon}
              title={segment.label}
              description={segment.tagline}
              onNavigate={onClose}
            />
          ))}
          <MegaMenuCompactItem
            href="/segmentos"
            icon="LayoutGrid"
            title="Ver todos os segmentos"
            description="Mais de 20 nichos prontos para usar."
            onNavigate={onClose}
          />
        </div>
      </MegaMenuColumn>

      <MegaMenuSidebar>
        <MegaMenuStory
          href="/casos"
          title="Clínica reduz faltas em 60% com lembretes automáticos."
          subtitle="Histórias reais de quem transformou a operação."
          onNavigate={onClose}
        />
        <MegaMenuLinks
          title="Compare segmentos"
          links={[
            { href: "/segmentos", label: "Catálogo completo" },
            { href: "/barbearia", label: "GestorPro para barbearias" },
            { href: "/restaurante", label: "GestorPro para restaurantes" },
          ]}
          onNavigate={onClose}
        />
      </MegaMenuSidebar>
    </MegaMenuGrid>
  );
}
