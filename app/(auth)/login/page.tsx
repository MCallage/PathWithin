import LoginClient from "./login-client";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginPage({
  searchParams,
}: {
  searchParams?: { callbackUrl?: string };
}) {
  const callbackUrl =
    typeof searchParams?.callbackUrl === "string" && searchParams.callbackUrl
      ? searchParams.callbackUrl
      : "/dashboard";

  return <LoginClient callbackUrl={callbackUrl} />;
}
