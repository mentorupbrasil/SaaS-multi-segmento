import type { PrismaClient } from "@prisma/client";
import { ALL_SEGMENTS } from "../segments";

export async function ensureDemoOrganizations(prisma: PrismaClient) {
  let created = 0;

  for (const segment of ALL_SEGMENTS) {
    const slug = `demo-${segment.id}`;
    const existing = await prisma.organization.findFirst({
      where: { OR: [{ slug }, { segmentId: segment.id, name: { contains: "Demo" } }] },
    });
    if (existing) continue;

    await prisma.organization.create({
      data: {
        name: `${segment.label} Demo`,
        slug,
        segmentId: segment.id,
        plan: "pro",
        subscriptionStatus: "ACTIVE",
        trialEndsAt: null,
        publicBookingEnabled: true,
        publicBookingSlug: slug,
        config: { onboardingCompleted: true },
        services: {
          create: (segment.defaultServices ?? []).slice(0, 3).map((s) => ({
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
              email: `demo+${segment.id}@gestorpro.local`,
            },
          ],
        },
      },
    });
    created += 1;
  }

  return created;
}
