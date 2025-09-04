"use client";
import { Badge } from "@/components/ui/badge";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { formatDate } from "@/lib/utils";
import { Dot } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { LeaseActions } from "./LeaseActions";
import { GetMyPaymentsType } from "@/app/data/user/payment/get-my-payments";
import { PaymentActions } from "./PaymentActions";
import { DEFAULT_LISTING_IMAGE } from "@/constants";

interface Props {
  payments: GetMyPaymentsType[];
}

export const PaymentsList = ({ payments }: Props) => {
  return (
    <div className="md:hidden">
      {payments.map((payment) => {
        const cover =
          payment.Lease.Listing.photos.find((photo) => photo.cover) ||
          payment.Lease.Listing?.photos[0];
        const photoUrl = cover
          ? useConstructUrl(cover?.src)
          : DEFAULT_LISTING_IMAGE;
        return (
          <Link
            key={payment.id}
            href={`/payments/${payment.id}`}
            className="flex items-center relative justify-start gap-2 hover:bg-muted p-2 rounded-lg group"
          >
            <Image
              src={photoUrl}
              alt={`${payment.Lease.Listing.title}'s photo`}
              width={1000}
              height={1000}
              className="size-[80px] rounded-lg object-cover"
            />
            <div>
              <h5 className="text-base font-medium group-hover:underline group-hover:text-primary transition-all">
                {payment.Lease.Listing.title}{" "}
                <Badge
                  variant={
                    payment.status === "PENDING"
                      ? "pending"
                      : payment.status === "SUCCESS"
                      ? "success"
                      : payment.status === "CANCELLED"
                      ? "destructive"
                      : payment.status === "FAILED"
                      ? "destructive"
                      : payment.status === "REFUNDED"
                      ? "secondary"
                      : "default"
                  }
                  className="capitalize"
                >
                  {payment.status === "CANCELLED" && "Cancelled"}
                  {payment.status === "PENDING" && "Pending"}
                  {payment.status === "FAILED" && "Failed"}
                  {payment.status === "REFUNDED" && "Refunded"}
                  {payment.status === "SUCCESS" && "Success"}
                </Badge>
              </h5>
              <p className="text-sm text-muted-foreground">
                {payment.Lease.leaseId} <Dot className="inline-block" />{" "}
                <span>{formatDate(payment.paidAt)}</span>{" "}
              </p>
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="absolute top-1/2 right-1 -translate-y-1/2 -translate-x-1"
            >
              <PaymentActions id={payment.id} payment={payment} />
            </div>
          </Link>
        );
      })}
    </div>
  );
};
