import Link from "next/link";
import { Icon } from "@/components/icon";
import { verifyEmailAction } from "../password-actions";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;
  const result = token ? await verifyEmailAction(token) : { error: "Token inválido." };

  return (
    <div className="w-full max-w-md">
      <div className="card overflow-hidden text-center">
        <div className="px-8 py-10">
          {result.ok ? (
            <>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Icon name="Check" className="h-7 w-7" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-foreground">E-mail confirmado</h1>
              <p className="mt-2 text-sm text-muted-foreground">{result.message}</p>
              <Link href="/login" className="btn-primary mt-6 inline-flex px-6 py-2.5">
                Fazer login
              </Link>
            </>
          ) : (
            <>
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                <Icon name="X" className="h-7 w-7" />
              </span>
              <h1 className="mt-4 text-xl font-bold text-foreground">Não foi possível confirmar</h1>
              <p className="mt-2 text-sm text-muted-foreground">{result.error}</p>
              <Link href="/login" className="mt-6 inline-block text-sm font-semibold text-primary hover:underline">
                Voltar ao login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
