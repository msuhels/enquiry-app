import { VerifyOTPForm } from "@/components/modules/auth-module/forms/verify-otp-form";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify OTP - Reset Password",
  description: "Enter the OTP code to reset your password",
};

export default async function VerifyOTPPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const params = await searchParams;
  const email = params.email || "";

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <VerifyOTPForm email={email} />
      </div>
    </div>
  );
}
