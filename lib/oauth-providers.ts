import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";

/** OAuth providers enabled only when credentials are configured. */
export function getOAuthProviders(): Provider[] {
  const providers: Provider[] = [];

  const googleId = process.env.GOOGLE_CLIENT_ID;
  const googleSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (googleId && googleSecret) {
    providers.push(
      Google({
        clientId: googleId,
        clientSecret: googleSecret,
        allowDangerousEmailAccountLinking: false,
      }),
    );
  }

  return providers;
}
