import { Suspense } from "react";
import ResetPasswordForm from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="card w-full max-w-md p-8 text-center text-sm text-muted-foreground">Carregando...</div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
