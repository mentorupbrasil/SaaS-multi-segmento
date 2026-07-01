"use client";

import { useMemo } from "react";
import Link from "next/link";
import AutoScroll from "embla-carousel-auto-scroll";
import { useReducedMotion } from "framer-motion";
import { ALL_SEGMENTS } from "@/segments";
import { getFeaturedSegments } from "@/lib/segment-vitrine";
import { Icon } from "@/components/icon";
import { FadeIn } from "@/components/motion/fade-in";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface LogoItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

interface LogosStripProps {
  heading?: string;
  className?: string;
}

import { getFeaturedSegments } from "@/lib/segment-vitrine";

function buildLogoItems(): LogoItem[] {
  const featured = getFeaturedSegments();
  const featuredIds = new Set(featured.map((s) => s.id));
  const rest = ALL_SEGMENTS.filter((s) => !featuredIds.has(s.id)).slice(0, 10);

  return [...featured, ...rest].map((seg) => ({
    id: seg.id,
    label: seg.label,
    href: `/${seg.slug}`,
    icon: seg.icon,
  }));
}

export function LogosStrip({
  heading = "Empresas que utilizam nossos serviços",
  className,
}: LogosStripProps) {
  const reduceMotion = useReducedMotion();
  const logos = useMemo(() => buildLogoItems(), []);

  const plugins = useMemo(
    () =>
      reduceMotion
        ? []
        : [
            AutoScroll({
              playOnInit: true,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              speed: 0.85,
            }),
          ],
    [reduceMotion],
  );

  return (
    <section className={cn("border-b border-border bg-muted/20 py-10 md:py-14", className)} aria-labelledby="logos-heading">
      <FadeIn className="section flex flex-col items-center text-center">
        <h2 id="logos-heading" className="text-balance max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl">
          {heading}
        </h2>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          De barbearias a clínicas e restaurantes — negócios de todos os segmentos confiam no GestorPro.
        </p>
      </FadeIn>

      <div className="section pt-8 md:pt-10">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel opts={{ loop: true, align: "start", dragFree: true }} plugins={plugins}>
            <CarouselContent className="-ml-2 md:-ml-4">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="flex basis-1/2 justify-center pl-2 sm:basis-1/3 md:basis-1/4 md:pl-4 lg:basis-1/5 xl:basis-1/6"
                >
                  <Link
                    href={logo.href}
                    className="group mx-4 flex shrink-0 items-center gap-2.5 rounded-2xl border border-border/60 bg-card px-4 py-3 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md md:mx-6 md:px-5"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
                      <Icon name={logo.icon} className="h-4 w-4" />
                    </span>
                    <span className="whitespace-nowrap text-sm font-semibold text-muted-foreground transition-colors group-hover:text-foreground">
                      {logo.label}
                    </span>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-muted/20 to-transparent md:w-16"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-muted/20 to-transparent md:w-16"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}

/** @deprecated Use LogosStrip */
export function SocialProofStrip() {
  return <LogosStrip />;
}
