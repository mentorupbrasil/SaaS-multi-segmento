"use client";

import { useMemo } from "react";
import Image from "next/image";
import AutoScroll from "embla-carousel-auto-scroll";
import { useReducedMotion } from "framer-motion";
import { FadeIn } from "@/components/motion/fade-in";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface Logo {
  id: string;
  description: string;
  image: string;
  /** Logos com cor de marca — não inverter no dark mode */
  preserveColor?: boolean;
}

const DEFAULT_LOGOS: Logo[] = [
  {
    id: "logo-1",
    description: "Astro",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg",
  },
  {
    id: "logo-2",
    description: "Figma",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/figma-wordmark.svg",
  },
  {
    id: "logo-3",
    description: "Next.js",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/nextjs-wordmark.svg",
  },
  {
    id: "logo-4",
    description: "React",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-wordmark.svg",
  },
  {
    id: "logo-5",
    description: "shadcn/ui",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcn-ui-wordmark.svg",
  },
  {
    id: "logo-6",
    description: "Supabase",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/supabase-wordmark.svg",
    preserveColor: true,
  },
  {
    id: "logo-7",
    description: "Tailwind CSS",
    image: "/logos/tailwindcss.svg",
    preserveColor: true,
  },
  {
    id: "logo-8",
    description: "Vercel",
    image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vercel-wordmark.svg",
  },
];

const LOGO_SLOT_CLASS = "mx-5 flex h-8 w-[7.5rem] shrink-0 items-center justify-center sm:mx-6 md:mx-8";
const LOGO_IMAGE_CLASS =
  "h-7 w-full max-w-[7.5rem] object-contain object-center opacity-80 transition-opacity hover:opacity-100";

function LogoImage({ logo }: { logo: Logo }) {
  return (
    <div className={LOGO_SLOT_CLASS}>
      <Image
        src={logo.image}
        alt={logo.description}
        width={120}
        height={28}
        unoptimized
        className={cn(
          LOGO_IMAGE_CLASS,
          !logo.preserveColor && "dark:brightness-0 dark:invert dark:opacity-70 dark:hover:opacity-100",
          logo.preserveColor && "dark:opacity-70 dark:hover:opacity-100",
        )}
      />
    </div>
  );
}

interface LogosStripProps {
  heading?: string;
  logos?: Logo[];
  className?: string;
}

export function LogosStrip({
  heading = "Empresas que utilizam nossos serviços",
  logos = DEFAULT_LOGOS,
  className,
}: LogosStripProps) {
  const reduceMotion = useReducedMotion();

  const carouselLogos = useMemo(() => [...logos, ...logos], [logos]);

  const plugins = useMemo(
    () =>
      reduceMotion
        ? []
        : [
            AutoScroll({
              playOnInit: true,
              stopOnInteraction: false,
              stopOnMouseEnter: true,
              speed: 1,
            }),
          ],
    [reduceMotion],
  );

  return (
    <section className={cn("border-b border-border bg-muted/20 py-10 md:py-14", className)} aria-labelledby="logos-heading">
      <FadeIn className="section flex flex-col items-center text-center">
        <h2
          id="logos-heading"
          className="text-balance max-w-2xl text-xl font-bold tracking-tight text-foreground sm:text-2xl lg:text-3xl"
        >
          {heading}
        </h2>
        <p className="mt-2 max-w-lg text-sm text-muted-foreground">
          De barbearias a clínicas e restaurantes — negócios de todos os segmentos confiam no GestorPro.
        </p>
      </FadeIn>

      <div className="section pt-8 md:pt-10">
        <div className="relative mx-auto flex items-center justify-center lg:max-w-5xl">
          <Carousel opts={{ loop: true, align: "start", dragFree: true }} plugins={plugins} className="w-full">
            <CarouselContent className="ml-0">
              {carouselLogos.map((logo, index) => (
                <CarouselItem key={`${logo.id}-${index}`} className="flex basis-auto justify-center pl-0">
                  <LogoImage logo={logo} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-muted/20 to-transparent sm:w-12"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-muted/20 to-transparent sm:w-12"
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
