export const dynamic = "force-dynamic";

import { SiteHeader } from "@/components/sidebar/site-header";
import WalletActiveUI from "./_components/WalletActiveUI";
import WalletStateHandler from "./_components/WalletStateHandler";
import { getWalletDetails } from "./actions";
import { PageHeader } from "@/components/PageHeader";

export default async function WalletPage() {
  const { data, error } = await getWalletDetails();

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        Something went wrong. Please refresh.
      </div>
    );
  }

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <PageHeader
          description={"Manage your rental funds and payments."}
          title={"My Wallet"}
        />
        <div className="mt-4">
          {data.state === "WALLET_ACTIVE" ? (
            <WalletActiveUI wallet={data} />
          ) : (
            <WalletStateHandler wallet={data} />
          )}
        </div>
      </div>
    </div>
  );
}
