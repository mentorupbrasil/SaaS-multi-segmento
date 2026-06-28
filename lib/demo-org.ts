import { prisma } from "@/lib/db";
import { ALL_SEGMENTS } from "@/segments";

export async function getOrCreateDemoOrganization(segmentId: string) {
  const slug = `demo-${segmentId}`;

  const existing = await prisma.organization.findFirst({
    where: {
      OR: [{ slug }, { slug: { startsWith: `${slug}-` } }],
    },
    orderBy: { createdAt: "asc" },
  });
  if (existing) return existing;

  const segment = ALL_SEGMENTS.find((s) => s.id === segmentId);
  if (!segment) return null;

  const taken = await prisma.organization.findUnique({ where: { slug } });
  const finalSlug = taken ? `demo-${segment.id}-${Date.now()}` : slug;

  return prisma.organization.create({
    data: {
      name: `${segment.label} Demo`,
      slug: finalSlug,
      segmentId: segment.id,
      plan: "pro",
      subscriptionStatus: "ACTIVE",
      config: { onboardingCompleted: true },
      publicBookingEnabled: true,
      publicBookingSlug: finalSlug,
      services: {
        create: (segment.defaultServices ?? []).slice(0, 2).map((s) => ({
          name: s.name,
          price: s.price,
          durationMin: s.durationMin,
        })),
      },
      customers: {
        create: [
          {
            name: `Cliente demo — ${segment.label}`,
            phone: "(11) 90000-0000",
          },
        ],
      },
    },
  });
}
