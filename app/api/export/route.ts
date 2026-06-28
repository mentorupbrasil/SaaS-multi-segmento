import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { exportTableResponse, type ExportFormat } from "@/lib/export-excel";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";

const ALLOWED = new Set([
  "clientes",
  "servicos",
  "fornecedores",
  "estoque",
  "pets",
  "eventos",
  "agenda",
  "orcamentos",
  "ordens-de-servico",
  "financeiro",
  "equipe",
  "veiculos",
  "quartos",
  "reservas",
  "doacoes",
  "grupos",
  "turmas",
  "matriculas",
  "vacinas",
  "pacotes",
  "comissoes",
]);

function respond(
  format: ExportFormat,
  slug: string,
  date: string,
  headers: string[],
  rows: string[][],
) {
  return exportTableResponse(format, `${slug}-${date}`, headers, rows);
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 });
  }

  const url = new URL(request.url);
  const exportModule = url.searchParams.get("module") ?? "";
  const q = url.searchParams.get("q")?.trim() ?? "";
  const format: ExportFormat = url.searchParams.get("format") === "xlsx" ? "xlsx" : "csv";

  if (!ALLOWED.has(exportModule)) {
    return new Response("Módulo inválido", { status: 400 });
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });
  if (!membership) {
    return new Response("Forbidden", { status: 403 });
  }

  const orgId = membership.organizationId;
  const date = new Date().toISOString().slice(0, 10);

  switch (exportModule) {
    case "clientes": {
      const rows = await prisma.customer.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        orderBy: { name: "asc" },
      });
      return respond(
        format,
        "clientes",
        date,
        ["Nome", "Telefone", "E-mail", "Cadastro"],
        rows.map((r) => [r.name, r.phone ?? "", r.email ?? "", formatDate(r.createdAt)]),
      );
    }

    case "servicos": {
      const rows = await prisma.service.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        orderBy: { name: "asc" },
      });
      return respond(
        format,
        "servicos",
        date,
        ["Nome", "Preço", "Duração (min)", "Ativo"],
        rows.map((r) => [
          r.name,
          formatCurrency(r.price),
          String(r.durationMin),
          r.active ? "Sim" : "Não",
        ]),
      );
    }

    case "fornecedores": {
      const rows = await prisma.supplier.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        orderBy: { name: "asc" },
      });
      return respond(
        format,
        "fornecedores",
        date,
        ["Nome", "Telefone", "E-mail", "CNPJ"],
        rows.map((r) => [r.name, r.phone ?? "", r.email ?? "", r.document ?? ""]),
      );
    }

    case "estoque": {
      const rows = await prisma.inventoryItem.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        orderBy: { name: "asc" },
      });
      return respond(
        format,
        "estoque",
        date,
        ["Produto", "SKU", "Quantidade", "Mínimo", "Preço"],
        rows.map((r) => [
          r.name,
          r.sku ?? "",
          String(r.quantity),
          String(r.minQuantity),
          formatCurrency(r.unitPrice),
        ]),
      );
    }

    case "pets": {
      const rows = await prisma.pet.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        include: { customer: { select: { name: true } } },
        orderBy: { name: "asc" },
      });
      return respond(
        format,
        "pets",
        date,
        ["Pet", "Tutor", "Espécie", "Raça"],
        rows.map((r) => [r.name, r.customer.name, r.species ?? "", r.breed ?? ""]),
      );
    }

    case "eventos": {
      const rows = await prisma.businessEvent.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
        },
        include: { customer: { select: { name: true } } },
        orderBy: { eventDate: "desc" },
      });
      return respond(
        format,
        "eventos",
        date,
        ["Título", "Cliente", "Data", "Status", "Valor"],
        rows.map((r) => [
          r.title,
          r.customer?.name ?? "",
          r.eventDate ? formatDate(r.eventDate) : "",
          r.status,
          formatCurrency(r.total),
        ]),
      );
    }

    case "agenda": {
      const rows = await prisma.appointment.findMany({
        where: {
          organizationId: orgId,
          ...(q
            ? {
                OR: [
                  { customer: { name: { contains: q, mode: "insensitive" } } },
                  { service: { name: { contains: q, mode: "insensitive" } } },
                ],
              }
            : {}),
        },
        include: {
          customer: { select: { name: true } },
          service: { select: { name: true } },
          staff: { include: { user: { select: { name: true } } } },
        },
        orderBy: { startAt: "asc" },
      });
      return respond(
        format,
        "agenda",
        date,
        ["Data/Hora", "Cliente", "Serviço", "Profissional", "Status"],
        rows.map((r) => [
          formatDateTime(r.startAt),
          r.customer.name,
          r.service?.name ?? "",
          r.staff?.user.name ?? "",
          r.status,
        ]),
      );
    }

    case "orcamentos": {
      const rows = await prisma.quote.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
        },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
      return respond(
        format,
        "orcamentos",
        date,
        ["Título", "Cliente", "Status", "Valor", "Data"],
        rows.map((r) => [
          r.title,
          r.customer?.name ?? "",
          r.status,
          formatCurrency(r.total),
          formatDate(r.createdAt),
        ]),
      );
    }

    case "ordens-de-servico": {
      const rows = await prisma.workOrder.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { title: { contains: q, mode: "insensitive" } } : {}),
        },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
      return respond(
        format,
        "ordens-de-servico",
        date,
        ["Título", "Cliente", "Status", "Valor", "Data"],
        rows.map((r) => [
          r.title,
          r.customer?.name ?? "",
          r.status,
          formatCurrency(r.total),
          formatDate(r.createdAt),
        ]),
      );
    }

    case "financeiro": {
      const rows = await prisma.financialEntry.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { description: { contains: q, mode: "insensitive" } } : {}),
        },
        orderBy: { createdAt: "desc" },
      });
      return respond(
        format,
        "financeiro",
        date,
        ["Descrição", "Tipo", "Valor", "Vencimento", "Status"],
        rows.map((r) => [
          r.description,
          r.type === "INCOME" ? "Receita" : "Despesa",
          formatCurrency(r.amount),
          r.dueDate ? formatDate(r.dueDate) : "",
          r.status,
        ]),
      );
    }

    case "equipe": {
      const rows = await prisma.membership.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { user: { name: { contains: q, mode: "insensitive" } } } : {}),
        },
        include: { user: true },
        orderBy: { role: "asc" },
      });
      return respond(
        format,
        "equipe",
        date,
        ["Nome", "E-mail", "Cargo", "Permissão"],
        rows.map((r) => [r.user.name, r.user.email ?? "", r.title ?? "", r.role]),
      );
    }

    case "veiculos": {
      const rows = await prisma.vehicle.findMany({
        where: {
          organizationId: orgId,
          ...(q
            ? {
                OR: [
                  { plate: { contains: q, mode: "insensitive" } },
                  { model: { contains: q, mode: "insensitive" } },
                ],
              }
            : {}),
        },
        include: { customer: { select: { name: true } } },
        orderBy: { plate: "asc" },
      });
      return respond(
        format,
        "veiculos",
        date,
        ["Placa", "Modelo", "Cliente", "Marca", "Ano"],
        rows.map((r) => [
          r.plate,
          r.model,
          r.customer.name,
          r.brand ?? "",
          r.year != null ? String(r.year) : "",
        ]),
      );
    }

    case "quartos": {
      const rows = await prisma.room.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { number: { contains: q, mode: "insensitive" } } : {}),
        },
        orderBy: { number: "asc" },
      });
      return respond(
        format,
        "quartos",
        date,
        ["Número", "Tipo", "Status", "Diária"],
        rows.map((r) => [r.number, r.type ?? "", r.status, formatCurrency(r.dailyRate)]),
      );
    }

    case "reservas": {
      const rows = await prisma.reservation.findMany({
        where: { organizationId: orgId },
        include: {
          room: { select: { number: true } },
          customer: { select: { name: true } },
        },
        orderBy: { checkIn: "desc" },
      });
      return respond(
        format,
        "reservas",
        date,
        ["Quarto", "Cliente", "Check-in", "Check-out", "Status", "Total"],
        rows.map((r) => [
          r.room.number,
          r.customer.name,
          formatDate(r.checkIn),
          formatDate(r.checkOut),
          r.status,
          formatCurrency(r.total),
        ]),
      );
    }

    case "doacoes": {
      const rows = await prisma.donation.findMany({
        where: { organizationId: orgId },
        include: { customer: { select: { name: true } } },
        orderBy: { receivedAt: "desc" },
      });
      return respond(
        format,
        "doacoes",
        date,
        ["Valor", "Tipo", "Doador", "Descrição", "Recebida em"],
        rows.map((r) => [
          formatCurrency(r.amount),
          r.donationType ?? "",
          r.customer?.name ?? "Anônimo",
          r.description ?? "",
          formatDate(r.receivedAt),
        ]),
      );
    }

    case "grupos": {
      const rows = await prisma.group.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        include: { _count: { select: { members: true } } },
        orderBy: { name: "asc" },
      });
      return respond(
        format,
        "grupos",
        date,
        ["Nome", "Tipo", "Membros"],
        rows.map((r) => [r.name, r.groupType ?? "", String(r._count.members)]),
      );
    }

    case "turmas": {
      const rows = await prisma.schoolClass.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        orderBy: { name: "asc" },
      });
      return respond(
        format,
        "turmas",
        date,
        ["Turma", "Período", "Turno", "Capacidade"],
        rows.map((r) => [r.name, r.period ?? "", r.shift ?? "", String(r.capacity ?? "")]),
      );
    }

    case "matriculas": {
      const rows = await prisma.enrollment.findMany({
        where: { organizationId: orgId },
        include: {
          customer: { select: { name: true } },
          class: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return respond(
        format,
        "matriculas",
        date,
        ["Aluno", "Turma", "Status", "Matrícula"],
        rows.map((r) => [
          r.customer.name,
          r.class.name,
          r.status,
          formatDate(r.enrolledAt),
        ]),
      );
    }

    case "vacinas": {
      const rows = await prisma.vaccination.findMany({
        where: {
          organizationId: orgId,
          ...(q
            ? {
                OR: [
                  { vaccine: { contains: q, mode: "insensitive" } },
                  { pet: { name: { contains: q, mode: "insensitive" } } },
                ],
              }
            : {}),
        },
        include: {
          pet: { include: { customer: { select: { name: true } } } },
        },
        orderBy: { appliedAt: "desc" },
      });
      return respond(
        format,
        "vacinas",
        date,
        ["Pet", "Tutor", "Vacina", "Aplicada em", "Próxima dose"],
        rows.map((r) => [
          r.pet.name,
          r.pet.customer.name,
          r.vaccine,
          formatDate(r.appliedAt),
          r.nextDueAt ? formatDate(r.nextDueAt) : "",
        ]),
      );
    }

    case "pacotes": {
      const rows = await prisma.sessionPackage.findMany({
        where: {
          organizationId: orgId,
          ...(q ? { name: { contains: q, mode: "insensitive" } } : {}),
        },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      });
      return respond(
        format,
        "pacotes",
        date,
        ["Pacote", "Cliente", "Sessões", "Valor", "Validade"],
        rows.map((r) => [
          r.name,
          r.customer.name,
          `${r.usedSessions}/${r.totalSessions}`,
          formatCurrency(r.price),
          r.expiresAt ? formatDate(r.expiresAt) : "",
        ]),
      );
    }

    case "comissoes": {
      const rows = await prisma.commissionEntry.findMany({
        where: { organizationId: orgId },
        include: {
          staff: { include: { user: { select: { name: true } } } },
          customer: { select: { name: true } },
        },
        orderBy: { createdAt: "desc" },
      });
      return respond(
        format,
        "comissoes",
        date,
        ["Profissional", "Descrição", "Cliente", "Valor", "Status", "Data"],
        rows.map((r) => [
          r.staff.user.name,
          r.description.replace(/ \[apt:[^\]]+\]/, ""),
          r.customer?.name ?? "",
          formatCurrency(r.amount),
          r.paidAt ? "Pago" : "Pendente",
          formatDate(r.createdAt),
        ]),
      );
    }

    default:
      return new Response("Módulo inválido", { status: 400 });
  }
}
