import { SOLUTIONS, type Solution } from "@/lib/solutions";

export function getSolutions(): Solution[] {
  return SOLUTIONS;
}

export function filterSolutions(query: string): Solution[] {
  const q = query.trim().toLowerCase();
  if (!q) return SOLUTIONS;
  return SOLUTIONS.filter(
    (s) =>
      s.title.toLowerCase().includes(q) ||
      s.headline.toLowerCase().includes(q) ||
      s.pain.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.bullets.some((b) => b.toLowerCase().includes(q)),
  );
}

export function getSolutionTotal(): number {
  return SOLUTIONS.length;
}
