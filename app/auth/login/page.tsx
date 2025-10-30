import { LoginForm } from "@/components/modules/auth-module/forms/login-form";
import { Metadata } from "next";
import Image from "next/image";
import logo from "@/app/Alzato logo.svg"

export const metadata: Metadata = {
  title: "Login",
  description: "Sign in to your account",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        {/* <Image
          src={logo}
          alt="Alzato"
          width={200}
          height={120}
          className="object-contain"
        /> */}
        <LoginForm />
      </div>
    </div>
  );
}
