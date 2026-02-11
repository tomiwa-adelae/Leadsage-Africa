// "use client";

// import {
//   CreditCard,
//   ArrowUpRight,
//   ArrowDownLeft,
//   Copy,
//   CheckCircle2,
// } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";

// export default function WalletActiveUI({ wallet }: { wallet: any }) {
//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Account number copied!");
//   };

//   return (
//     <div className="space-y-6">
//       {/* Balance Card */}
//       <div className="grid gap-6 md:grid-cols-2">
//         <Card className="bg-primary text-primary-foreground border-none shadow-xl overflow-hidden relative">
//           <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl" />
//           <CardContent className="p-6 space-y-4">
//             <div className="flex justify-between items-start">
//               <p className="text-sm font-medium opacity-80">
//                 Available Balance
//               </p>
//               <CheckCircle2 className="w-5 h-5 text-green-400" />
//             </div>
//             <h2 className="text-4xl font-bold">
//               ₦
//               {wallet.balance.available.toLocaleString(undefined, {
//                 minimumFractionDigits: 2,
//               })}
//             </h2>
//             <div className="flex gap-2 pt-4">
//               <Button variant="secondary" className="flex-1 gap-2">
//                 <ArrowUpRight className="w-4 h-4" /> Fund
//               </Button>
//               <Button
//                 variant="secondary"
//                 className="flex-1 gap-2 bg-white/20 border-none hover:bg-white/30 text-white"
//               >
//                 <ArrowDownLeft className="w-4 h-4" /> Withdraw
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Account Details Card */}
//         <Card className="border-dashed border-2">
//           <CardHeader className="pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">
//               Virtual Account (Bank Transfer)
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div>
//               <p className="text-2xl font-mono font-bold tracking-wider">
//                 {wallet.account.accountNumber}
//               </p>
//               <p className="text-sm text-muted-foreground uppercase">
//                 {wallet.account.bankName}
//               </p>
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               className="gap-2"
//               onClick={() => copyToClipboard(wallet.account.accountNumber)}
//             >
//               <Copy className="w-4 h-4" /> Copy Account
//             </Button>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Transaction History Placeholder */}
//       <div className="space-y-4">
//         <h3 className="font-semibold text-lg">Recent Transactions</h3>
//         <Card>
//           <CardContent className="p-8 text-center space-y-3">
//             <div className="bg-muted w-12 h-12 rounded-full flex items-center justify-center mx-auto">
//               <CreditCard className="text-muted-foreground" />
//             </div>
//             <p className="text-muted-foreground text-sm">
//               No transactions yet. Start by funding your wallet.
//             </p>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }

"use client";

import {
  Info,
  Copy,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function WalletActiveUI({ wallet }: { wallet: any }) {
  const formatMoney = (val: number) =>
    `₦${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  return (
    <div className="space-y-6">
      <Card className="bg-slate-900 border-none shadow-2xl relative overflow-hidden">
        {/* Decorative background flare */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-3xl rounded-full" />

        <CardContent className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-1">
              <p className="text-slate-400 text-sm font-medium flex items-center gap-1">
                Available Balance
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-3 h-3" />
                    </TooltipTrigger>
                    <TooltipContent>
                      Money you can use immediately
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
              <h2 className="text-5xl font-bold tracking-tight">
                {formatMoney(wallet.balance.available)}
              </h2>
            </div>
            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
              {wallet.account.bankName}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-6">
            <div>
              <p className="text-slate-400 text-xs uppercase tracking-wider">
                Ledger Balance
              </p>
              <p className="text-lg font-semibold">
                {formatMoney(wallet.balance.ledger)}
              </p>
            </div>
            {wallet.balance.hold > 0 && (
              <div>
                <p className="text-slate-400 text-xs uppercase tracking-wider">
                  On Hold
                </p>
                <p className="text-lg font-semibold text-orange-400">
                  {formatMoney(wallet.balance.hold)}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-8">
            <Button className="flex-1 h-12 text-lg font-bold" variant="default">
              <ArrowUpRight className="mr-2 w-5 h-5" /> Fund Wallet
            </Button>
            <Button
              className="flex-1 h-12 text-lg font-bold bg-slate-800 hover:bg-slate-700"
              variant="secondary"
            >
              <ArrowDownLeft className="mr-2 w-5 h-5" /> Withdraw
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Info Bar */}
      <div className="bg-slate-50 border rounded-2xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center border shadow-sm">
            <span className="font-bold text-primary">A</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-medium uppercase">
              Virtual Account Number
            </p>
            <p className="font-mono text-lg font-bold tracking-widest">
              {wallet.account.accountNumber}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            navigator.clipboard.writeText(wallet.account.accountNumber);
            toast.success("Copied to clipboard");
          }}
        >
          <Copy className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
