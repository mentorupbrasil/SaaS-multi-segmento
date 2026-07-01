"use client";

import { ALL_FEATURES } from "@/lib/features";
import { getFeatureGroups } from "@/lib/feature-vitrine";
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

const PRIMARY_FEATURE_IDS = ["clientes", "agenda", "financeiro", "relatorios", "portal"] as const;

export function FeaturesMenuPanel({ onClose }: { onClose?: () => void }) {
  const groups = getFeatureGroups();
  const primary = PRIMARY_FEATURE_IDS.map((id) => ALL_FEATURES.find((f) => f.id === id)).filter(
    (f): f is NonNullable<typeof f> => Boolean(f),
  );

  const moduleItems = groups.flatMap((group) => group.items.slice(0, 2)).slice(0, 4);

  return (
    <MegaMenuGrid>
      <MegaMenuColumn>
        <div className="space-y-0.5">
          {primary.map((item) =>
            item ? (
              <MegaMenuItem
                key={item.id}
                href={`/funcionalidades#${item.id}`}
                icon={item.icon}
                title={item.name}
                description={item.short}
                onNavigate={onClose}
              />
            ) : null,
          )}
        </div>
      </MegaMenuColumn>

      <MegaMenuColumn className="md:border-l md:border-border">
        <MegaMenuSectionTitle>Módulos</MegaMenuSectionTitle>
        <div className="space-y-0.5">
          {moduleItems.map((item) => (
            <MegaMenuCompactItem
              key={item.id}
              href={`/funcionalidades#${item.id}`}
              icon={item.icon}
              title={item.name}
              description={item.short}
              onNavigate={onClose}
            />
          ))}
          <MegaMenuCompactItem
            href="/funcionalidades"
            icon="Sparkles"
            title="Ver catálogo completo"
            description="Explore todos os recursos do GestorPro."
            onNavigate={onClose}
          />
        </div>
      </MegaMenuColumn>

      <MegaMenuSidebar>
        <MegaMenuStory
          href="/casos"
          title="Barbearia cresce 40% com agenda online e CRM integrado."
          subtitle="Como negócios locais usam o GestorPro para escalar."
          onNavigate={onClose}
        />
        <MegaMenuLinks
          title="Explore o GestorPro"
          links={[
            { href: "/funcionalidades", label: "Todas as funcionalidades" },
            { href: "/precos", label: "GestorPro vs planilhas" },
            { href: "/integracoes", label: "Integrações disponíveis" },
          ]}
          onNavigate={onClose}
        />
      </MegaMenuSidebar>
    </MegaMenuGrid>
  );
}
