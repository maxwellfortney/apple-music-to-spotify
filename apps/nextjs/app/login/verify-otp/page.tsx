import { InputOTPForm } from "@/components/verify-otp-form";

interface VerifyOTPPageProps {
  searchParams: { callbackUrl?: string }
}

export default function VerifyOTPPage({ searchParams }: VerifyOTPPageProps) {
  const { callbackUrl } = searchParams

  return (
    <div className="bg-background flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
      <div className="w-full max-w-sm">
        <InputOTPForm callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
