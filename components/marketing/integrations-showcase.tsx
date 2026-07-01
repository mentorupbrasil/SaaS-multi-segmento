import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { INTEGRATIONS, getIntegrationTotal } from "@/lib/integrations";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Logos oficiais (Simple Icons CDN) — fallback para ícone Lucide */
const INTEGRATION_LOGOS: Record<string, { src: string; darkInvert?: boolean }> = {
  whatsapp: { src: "https://cdn.simpleicons.org/whatsapp/25D366" },
  pix: { src: "https://cdn.simpleicons.org/pix/32BCAD" },
  mercadopago: { src: "https://cdn.simpleicons.org/mercadopago/00B1EA" },
  google_calendar: { src: "https://cdn.simpleicons.org/googlecalendar/4285F4" },
  public_booking: { src: "https://cdn.simpleicons.org/calendly/006BFF" },
  channel_manager: { src: "https://cdn.simpleicons.org/airbnb/FF5A5F" },
  instagram: { src: "https://cdn.simpleicons.org/instagram/E4405F", darkInvert: false },
  export: { src: "https://cdn.simpleicons.org/googlesheets/34A853" },
};

function IntegrationLogo({ id, name, icon }: { id: string; name: string; icon: string }) {
  const logo = INTEGRATION_LOGOS[id];

  if (logo) {
    return (
      <Image
        src={logo.src}
        alt=""
        width={16}
        height={16}
        unoptimized
        className={cn("size-4 shrink-0", logo.darkInvert !== false && "dark:brightness-0 dark:invert")}
      />
    );
  }

  return <Icon name={icon} className="size-4 shrink-0 text-muted-foreground" />;
}

export function IntegrationsShowcase() {
  const total = getIntegrationTotal();

  return (
    <section className="border-y border-border bg-background py-12 md:py-16">
      <div className="section space-y-8 md:space-y-10">
        <div className="relative z-10 mx-auto max-w-xl space-y-4 text-center md:space-y-5">
          <span className="eyebrow mx-auto">Integrações</span>
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Conecte com o que{" "}
            <span className="gradient-text">você já usa</span>
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
            {total} integrações ativas — ative no painel Conexões conforme o seu plano.
          </p>
        </div>

        <div className="relative mx-auto grid max-w-2xl divide-x divide-y border border-border bg-card sm:grid-cols-2 lg:max-w-4xl lg:grid-cols-3 [&>*]:p-5 sm:[&>*]:p-6">
          {INTEGRATIONS.map((item) => (
            <Link
              key={item.id}
              href="/integracoes"
              className="group space-y-2 transition-colors hover:bg-muted/40"
            >
              <div className="flex items-center gap-2">
                <IntegrationLogo id={item.id} name={item.name} icon={item.icon} />
                <h3 className="text-sm font-medium text-foreground group-hover:text-primary">{item.name}</h3>
              </div>
              <p className="text-sm leading-snug text-muted-foreground line-clamp-2">{item.description}</p>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button asChild variant="outline" size="sm">
            <Link href="/integracoes">
              Ver todas as integrações
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
