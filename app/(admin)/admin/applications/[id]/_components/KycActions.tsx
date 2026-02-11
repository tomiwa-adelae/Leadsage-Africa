"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ApproveKycModal } from "../../../_components/ApproveKycModal";
import { RejectKycModal } from "../../../_components/RejectKycModal";
import { KycStatus } from "@/lib/generated/prisma";

interface KycActionsProps {
  kycId: string;
  status: KycStatus;
}

export const KycActions = ({ kycId, status }: KycActionsProps) => {
  const [showApprove, setShowApprove] = useState(false);
  const [showReject, setShowReject] = useState(false);

  // If already approved, don't show the action buttons
  if (status === "VERIFIED") return null;

  return (
    <>
      <div className="flex gap-3 pt-2">
        <Button
          onClick={() => setShowApprove(true)}
          variant="default"
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          Approve KYC
        </Button>
        <Button
          onClick={() => setShowReject(true)}
          variant="destructive"
          className="flex-1"
        >
          Reject KYC
        </Button>
      </div>

      <ApproveKycModal
        kycId={kycId}
        open={showApprove}
        closeModal={() => setShowApprove(false)}
      />

      <RejectKycModal
        kycId={kycId}
        open={showReject}
        closeModal={() => setShowReject(false)}
      />
    </>
  );
};
