import { ShieldAlert, Clock, AlertCircle, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import Link from "next/link";

export default function WalletStateHandler({ wallet }: { wallet: any }) {
  const configs = {
    NO_WALLET: {
      icon: <UserCheck className="w-12 h-12 text-primary" />,
      title: "Activate Your Wallet",
      description:
        "You need to complete your identity verification to start making payments and funding your wallet.",
      button: (
        <Link href="/settings/kyc/tier-2">
          <Button size="lg">Verify Identity</Button>
        </Link>
      ),
      color: "bg-primary/5",
    },
    KYC_PENDING: {
      icon: <Clock className="w-12 h-12 text-orange-500" />,
      title: "Verification in Progress",
      description:
        "Our team is currently reviewing your documents. This usually takes 24-48 hours.",
      button: (
        <Button disabled variant="outline">
          Verification Pending
        </Button>
      ),
      color: "bg-orange-50",
    },
    KYC_REJECTED: {
      icon: <AlertCircle className="w-12 h-12 text-destructive" />,
      title: "Verification Failed",
      description:
        wallet.kyc?.rejectionReason ||
        "We couldn't verify your details. Please check your documents and try again.",
      button: (
        <Link href="/dashboard/kyc">
          <Button variant="destructive">Retry Verification</Button>
        </Link>
      ),
      color: "bg-red-50",
    },
    WALLET_SUSPENDED: {
      icon: <ShieldAlert className="w-12 h-12 text-slate-900" />,
      title: "Wallet Restricted",
      description:
        "Your wallet has been temporarily suspended for security reasons. Please contact support.",
      button: <Button variant="secondary">Contact Support</Button>,
      color: "bg-slate-100",
    },
  };

  const config =
    configs[wallet.state as keyof typeof configs] || configs.NO_WALLET;

  return (
    <div
      className={`rounded-3xl p-8 md:p-12 text-center flex flex-col items-center justify-center space-y-6 border ${config.color}`}
    >
      <div className="p-4 bg-white rounded-full shadow-sm">{config.icon}</div>
      <div className="max-w-md space-y-2">
        <h2 className="text-2xl font-bold">{config.title}</h2>
        <p className="text-muted-foreground">{config.description}</p>
      </div>
      {config.button}
    </div>
  );
}
