import LoginClient from "./login-client";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

type SP = { callbackUrl?: string };
type LoginPageProps = {
  searchParams?: SP | Promise<SP>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const sp = (await Promise.resolve(searchParams)) ?? {};

  const callbackUrl =
    typeof sp.callbackUrl === "string" && sp.callbackUrl
      ? sp.callbackUrl
      : "/dashboard";

  return <LoginClient callbackUrl={callbackUrl} />;
}
