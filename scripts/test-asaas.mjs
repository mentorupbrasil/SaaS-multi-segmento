/**
 * Testa a API Asaas fora do site — mostra o erro real da API.
 *
 * Uso (PowerShell):
 *   $env:ASAAS_API_KEY="sua_chave"; node scripts/test-asaas.mjs
 *
 * Sandbox:
 *   $env:ASAAS_ENV="sandbox"; $env:ASAAS_API_KEY="..."; node scripts/test-asaas.mjs
 */

const key = (process.env.ASAAS_API_KEY ?? "").trim().replace(/^["']+|["']+$/g, "");
const env = (process.env.ASAAS_ENV ?? "").trim().toLowerCase();
const isProd =
  env === "production" || env === "prod" || (key.includes("_prod_") && env !== "sandbox");
const base = isProd ? "https://api.asaas.com/v3" : "https://api-sandbox.asaas.com/v3";

const headers = {
  "Content-Type": "application/json",
  "User-Agent": "GestorPro/1.0 (test-asaas script)",
  access_token: key,
};

function parseError(body) {
  try {
    const j = JSON.parse(body);
    const e = j.errors?.[0];
    if (e?.description) return e.code ? `${e.description} (${e.code})` : e.description;
    if (j.message) return j.message;
  } catch {
    /* ignore */
  }
  return body.slice(0, 400) || "(resposta vazia)";
}

async function req(method, path, body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  return { ok: res.ok, status: res.status, text };
}

function ok(label, detail) {
  console.log(`  ✓ ${label}: ${detail}`);
}

function fail(label, detail) {
  console.log(`  ✗ ${label}: ${detail}`);
}

function dueDate(days = 1) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

async function main() {
  console.log("\n=== Teste Asaas (fora do GestorPro) ===\n");
  console.log(`Ambiente: ${isProd ? "produção" : "sandbox"}`);
  console.log(`Base URL: ${base}\n`);

  if (!key || key.length < 20) {
    fail("ASAAS_API_KEY", "não definida ou muito curta");
    console.log("\nDefina a variável e rode de novo.\n");
    process.exit(1);
  }
  ok("ASAAS_API_KEY", `${key.slice(0, 8)}…${key.slice(-4)}`);

  // 1) Ping API
  console.log("\n1) GET /customers (testa chave e User-Agent)");
  const list = await req("GET", "/customers?limit=1");
  if (!list.ok) {
    fail("GET /customers", `HTTP ${list.status} — ${parseError(list.text)}`);
    console.log("\nCorrija a chave ou ambiente antes de testar checkout.\n");
    process.exit(1);
  }
  ok("GET /customers", "conexão OK");

  // 2) Cliente de teste (CPF válido — só para diagnóstico)
  const testCpf = "52998224725";
  const testEmail = `gestorpro-test-${Date.now()}@example.com`;

  console.log("\n2) Buscar/criar cliente de teste");
  let customerId = null;
  const byCpf = await req("GET", `/customers?cpfCnpj=${testCpf}&limit=1`);
  if (byCpf.ok) {
    try {
      customerId = JSON.parse(byCpf.text).data?.[0]?.id ?? null;
    } catch {
      /* ignore */
    }
  }

  if (!customerId) {
    const created = await req("POST", "/customers", {
      name: "GestorPro Teste",
      email: testEmail,
      cpfCnpj: testCpf,
      externalReference: `test-${Date.now()}`,
    });
    if (!created.ok) {
      fail("POST /customers", `HTTP ${created.status} — ${parseError(created.text)}`);
      console.log("\nErro comum: CPF inválido, conta não aprovada, ou e-mail duplicado.\n");
      process.exit(1);
    }
    customerId = JSON.parse(created.text).id;
    ok("POST /customers", `criado id=${customerId}`);
  } else {
    ok("POST /customers", `já existe id=${customerId}`);
  }

  // 3) Assinatura mínima
  console.log("\n3) POST /subscriptions (R$ 5,00 — igual plano Inicial)");
  const sub = await req("POST", "/subscriptions", {
    customer: customerId,
    billingType: "UNDEFINED",
    value: 5,
    nextDueDate: dueDate(1),
    cycle: "MONTHLY",
    description: "GestorPro — teste script",
    externalReference: `test:${Date.now()}`,
  });
  if (!sub.ok) {
    fail("POST /subscriptions", `HTTP ${sub.status} — ${parseError(sub.text)}`);
    console.log(
      "\nSe falhar aqui, o botão Pagar no site também falha pelo mesmo motivo.\n",
    );
    process.exit(1);
  }
  const subId = JSON.parse(sub.text).id;
  ok("POST /subscriptions", `criada id=${subId}`);

  // 4) Link de pagamento
  console.log("\n4) GET /payments (link da fatura)");
  let invoiceUrl = null;
  for (let i = 0; i < 5; i += 1) {
    const pay = await req("GET", `/payments?subscription=${subId}&limit=5&order=asc`);
    if (pay.ok) {
      const data = JSON.parse(pay.text).data ?? [];
      const p = data.find((x) => x.invoiceUrl || x.bankSlipUrl) ?? data[0];
      invoiceUrl = p?.invoiceUrl ?? p?.bankSlipUrl ?? null;
    }
    if (invoiceUrl) break;
    await new Promise((r) => setTimeout(r, 800));
  }

  if (invoiceUrl) {
    ok("invoiceUrl", invoiceUrl);
    console.log("\n=== Tudo OK — abra o link acima no navegador para pagar ===\n");
  } else {
    fail("invoiceUrl", "cobrança criada, mas link ainda não disponível (tente em 1 min)");
    console.log(`Assinatura ${subId} — confira no painel Asaas.\n`);
  }
}

main().catch((e) => {
  console.error("\nErro inesperado:", e.message ?? e);
  process.exit(1);
});
