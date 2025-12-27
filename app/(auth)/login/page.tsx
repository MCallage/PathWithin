import LoginClient from "./login-client";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

type LoginPageProps = {
  searchParams?: Promise<{ callbackUrl?: string }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = (await searchParams) ?? {};

  const callbackUrl =
    typeof sp.callbackUrl === "string" && sp.callbackUrl
      ? sp.callbackUrl
      : "/dashboard";

  return <LoginClient callbackUrl={callbackUrl} />;
}
