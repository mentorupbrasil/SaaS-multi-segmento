"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqGroup {
  id: string;
  label: string;
  items: FaqItem[];
}

interface FaqProps {
  items?: FaqItem[];
  groups?: FaqGroup[];
  title?: string;
  description?: string;
  subtitle?: string;
  showSupportLinks?: boolean;
  className?: string;
}

function groupsToFaqData(sections: FaqGroup[]) {
  const categories = Object.fromEntries(sections.map((g) => [g.id, g.label]));
  const faqData = Object.fromEntries(
    sections.map((g) => [g.id, g.items.map((item) => ({ question: item.q, answer: item.a }))]),
  );
  return { categories, faqData };
}

export function Faq({
  items,
  groups,
  title = "Perguntas frequentes",
  description,
  subtitle = "Dúvidas",
  showSupportLinks = false,
  className,
}: FaqProps) {
  const reduceMotion = useReducedMotion();

  const sections: FaqGroup[] = useMemo(
    () => groups ?? (items ? [{ id: "all", label: "Geral", items }] : []),
    [groups, items],
  );

  const { categories, faqData } = useMemo(() => groupsToFaqData(sections), [sections]);
  const categoryKeys = Object.keys(categories);
  const [selectedCategory, setSelectedCategory] = useState(categoryKeys[0] ?? "");

  if (sections.length === 0) return null;

  return (
    <section
      id="faq"
      className={cn("relative overflow-hidden bg-background px-4 py-12 text-foreground md:py-16", className)}
    >
      <FAQHeader title={title} subtitle={subtitle} description={description} reduceMotion={reduceMotion} />

      {categoryKeys.length > 1 && (
        <FAQTabs
          categories={categories}
          selected={selectedCategory}
          setSelected={setSelectedCategory}
          reduceMotion={reduceMotion}
        />
      )}

      <FAQList faqData={faqData} selected={selectedCategory} reduceMotion={reduceMotion} />

      {showSupportLinks && (
        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-border bg-muted/40 px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <p className="text-sm text-muted-foreground">
            Ainda com dúvida? Veja{" "}
            <Link href="/precos" className="font-semibold text-primary hover:underline">
              planos e preços
            </Link>{" "}
            ou fale conosco em{" "}
            <Link href="/suporte" className="font-semibold text-primary hover:underline">
              suporte
            </Link>
            .
          </p>
          <Button asChild variant="outline" size="sm" className="shrink-0">
            <Link href="/suporte">Central de ajuda</Link>
          </Button>
        </div>
      )}
    </section>
  );
}

function FAQHeader({
  title,
  subtitle,
  description,
  reduceMotion,
}: {
  title: string;
  subtitle: string;
  description?: string;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center justify-center text-center">
      <span className="mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-sm font-medium text-transparent">
        {subtitle}
      </span>
      <h2 className="text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {description && (
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
      )}
      <span
        className={cn(
          "pointer-events-none absolute -top-48 left-1/2 z-0 h-[420px] w-[520px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary/10 to-primary/5 blur-3xl",
          reduceMotion && "hidden",
        )}
        aria-hidden
      />
    </div>
  );
}

function FAQTabs({
  categories,
  selected,
  setSelected,
  reduceMotion,
}: {
  categories: Record<string, string>;
  selected: string;
  setSelected: (key: string) => void;
  reduceMotion: boolean | null;
}) {
  return (
    <div className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
      {Object.entries(categories).map(([key, label]) => {
        const isSelected = selected === key;

        return (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className={cn(
              "relative overflow-hidden whitespace-nowrap rounded-md border px-3 py-1.5 text-sm font-medium transition-colors duration-300",
              isSelected
                ? "border-primary text-primary-foreground"
                : "border-border bg-transparent text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="relative z-10">{label}</span>
            {!reduceMotion && (
              <AnimatePresence>
                {isSelected && (
                  <motion.span
                    initial={{ y: "100%" }}
                    animate={{ y: "0%" }}
                    exit={{ y: "100%" }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] as const }}
                    className="absolute inset-0 z-0 bg-gradient-to-r from-primary to-primary/80"
                  />
                )}
              </AnimatePresence>
            )}
            {reduceMotion && isSelected && (
              <span className="absolute inset-0 z-0 bg-primary" aria-hidden />
            )}
          </button>
        );
      })}
    </div>
  );
}

function FAQList({
  faqData,
  selected,
  reduceMotion,
}: {
  faqData: Record<string, { question: string; answer: string }[]>;
  selected: string;
  reduceMotion: boolean | null;
}) {
  const questions = faqData[selected] ?? [];

  if (reduceMotion) {
    return (
      <div className="mx-auto mt-8 max-w-3xl space-y-3 md:mt-10">
        {questions.map((faq) => (
          <FAQItemStatic key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    );
  }

  return (
    <div className="mx-auto mt-8 max-w-3xl md:mt-10">
      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] as const }}
          className="space-y-3"
        >
          {questions.map((faq) => (
            <FAQItem key={faq.question} question={faq.question} answer={faq.answer} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      animate={isOpen ? "open" : "closed"}
      className={cn("rounded-xl border transition-colors", isOpen ? "border-border bg-muted/50" : "border-border bg-card")}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "text-base font-medium leading-snug transition-colors sm:text-lg",
            isOpen ? "text-foreground" : "text-muted-foreground",
          )}
        >
          {question}
        </span>
        <motion.span
          variants={{
            open: { rotate: "45deg" },
            closed: { rotate: "0deg" },
          }}
          transition={{ duration: 0.2 }}
          className="shrink-0"
        >
          <Plus
            className={cn("h-5 w-5 transition-colors", isOpen ? "text-foreground" : "text-muted-foreground")}
          />
        </motion.span>
      </button>
      <motion.div
        initial={false}
        animate={{
          height: isOpen ? "auto" : 0,
          marginBottom: isOpen ? 16 : 0,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="overflow-hidden px-4 sm:px-5"
      >
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{answer}</p>
      </motion.div>
    </motion.div>
  );
}

function FAQItemStatic({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("rounded-xl border border-border", isOpen ? "bg-muted/50" : "bg-card")}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
        aria-expanded={isOpen}
      >
        <span className="text-base font-medium leading-snug text-foreground sm:text-lg">{question}</span>
        <Plus className={cn("h-5 w-5 shrink-0 transition-transform", isOpen && "rotate-45")} />
      </button>
      {isOpen && <p className="px-4 pb-4 text-sm leading-relaxed text-muted-foreground sm:px-5 sm:pb-5">{answer}</p>}
    </div>
  );
}
