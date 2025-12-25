import LoginClient from "./login-client";

export const metadata = {
  title: "Login",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return <LoginClient />;
}
