"use client";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { IconCheckbox } from "@tabler/icons-react";
import { ConfirmBookingModal } from "../../../_components/ConfirmBookingModal";

interface Props {
  id: string;
}

export const MarkConfirmButton = ({ id }: Props) => {
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  return (
    <>
      <Button
        size="md"
        variant={"success"}
        onClick={(e) => {
          e.preventDefault(); // stops the Link from navigating
          e.stopPropagation();
          setOpenConfirmModal(true);
        }}
      >
        <IconCheckbox size={16} className="opacity-60" aria-hidden="true" />
        Confirm Booking
      </Button>
      {openConfirmModal && (
        <ConfirmBookingModal
          open={openConfirmModal}
          closeModal={() => setOpenConfirmModal(false)}
          id={id}
        />
      )}
    </>
  );
};
