"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { env } from "@/lib/env";

export type WalletState =
  | "NO_WALLET"
  | "KYC_PENDING"
  | "KYC_REJECTED"
  | "WALLET_ACTIVE"
  | "WALLET_SUSPENDED";

export interface WalletDetails {
  state: WalletState;
  balance: {
    available: number;
    ledger: number;
    currency: string;
    hold: number;
    pending: number;
  };
  account?: {
    accountNumber: string;
    bankName: string;
    accountName: string;
  };
  kyc?: {
    status: string;
    rejectionReason?: string | null;
  };
}

export const getWalletDetails = async (): Promise<{
  data?: WalletDetails;
  error?: string;
}> => {
  try {
    const { user } = await requireUser();

    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: { kyc: true },
    });

    if (!dbUser) return { error: "User not found" };

    const kycRecord = dbUser.kyc[0];
    let currentState: WalletState = "NO_WALLET";

    // Logic to determine UI State
    if (dbUser.walletStatus === "SUSPENDED") {
      currentState = "WALLET_SUSPENDED";
    } else if (kycRecord?.status === "REJECTED") {
      currentState = "KYC_REJECTED";
    } else if (kycRecord?.status === "PENDING") {
      currentState = "KYC_PENDING";
    } else if (
      dbUser.walletAccountNo &&
      (dbUser.walletStatus === "ACTIVE" || !dbUser.walletStatus)
    ) {
      // Logic check: if we have an account number, we treat it as ACTIVE for the UI
      currentState = "WALLET_ACTIVE";
    }

    let walletInfo: WalletDetails = {
      state: currentState,
      balance: {
        available: 0,
        ledger: 0,
        currency: "NGN",
        hold: 0,
        pending: 0,
      },
      kyc: {
        status: kycRecord?.status || "NOT_STARTED",
        rejectionReason: kycRecord?.rejectionReason,
      },
    };

    // Fetch REAL-TIME account data if we have a walletId
    if (dbUser.walletId) {
      const response = await fetch(
        `https://api.sandbox.getanchor.co/api/v1/accounts/${dbUser.walletId}`,
        {
          headers: {
            accept: "application/json",
            "x-anchor-key": env.ANCHOR_SECRET_KEY,
          },
          next: { revalidate: 60 }, // Optional: cache for 1 minute
        },
      );

      if (response.ok) {
        const json = await response.json();
        const attr = json.data.attributes;

        // Note: Anchor returns minor units (kobo). Convert to Naira.
        walletInfo.balance = {
          available: attr.availableBalance / 100,
          ledger: attr.ledgerBalance / 100,
          hold: attr.holdBalance / 100,
          pending: attr.pendingBalance / 100,
          currency: attr.currency,
        };

        walletInfo.account = {
          accountNumber: attr.accountNumber,
          bankName: attr.bank.name,
          accountName: attr.accountName,
        };

        // Sync local DB status if Anchor says it's different
        if (attr.status !== dbUser.walletStatus) {
          // Background update (don't await)
          prisma.user
            .update({
              where: { id: user.id },
              data: { walletStatus: attr.status },
            })
            .catch(console.error);
        }
      }
    }

    return { data: walletInfo };
  } catch (error) {
    console.error("WALLET_FETCH_ERROR", error);
    return { error: "Failed to fetch wallet information" };
  }
};

export const getWalletTransactions = async (walletId: string) => {
  try {
    const response = await fetch(
      `https://api.sandbox.getanchor.co/api/v1/accounts/${walletId}/transactions`,
      {
        headers: {
          accept: "application/json",
          "x-anchor-key": env.ANCHOR_SECRET_KEY,
        },
      },
    );

    const json = await response.json();
    return json.data; // Array of transaction objects
  } catch (error) {
    return [];
  }
};
