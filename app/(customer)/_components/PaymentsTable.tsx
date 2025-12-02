"use client";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { useConstructUrl } from "@/hooks/use-construct-url";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { NairaIcon } from "@/components/NairaIcon";
import { GetMyPaymentsType } from "@/app/data/user/payment/get-my-payments";
import { PaymentActions } from "./PaymentActions";
import { GetLeasePaymentsType } from "@/app/data/user/lease/get-lease-payments";

interface Props {
  payments: GetMyPaymentsType[] | GetLeasePaymentsType[];
}

export function PaymentsTable({ payments }: Props) {
  const router = useRouter();
  return (
    <div className="hidden md:block">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Lease ID</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Landlord's name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount paid</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => {
            const cover =
              payment.Lease.Listing.photos.find((photo) => photo.cover) ||
              payment.Lease.Listing?.photos[0];
            const photoUrl = cover
              ? useConstructUrl(cover?.src)
              : DEFAULT_LISTING_IMAGE;
            return (
              <TableRow
                className="group cursor-pointer"
                key={payment.id}
                onClick={() => {
                  router.push(`/payments/${payment.id}`);
                }}
              >
                <TableCell className="font-medium">
                  {payment.Lease.leaseId}
                </TableCell>
                <TableCell className="flex items-center justify-start gap-2">
                  <Image
                    src={photoUrl}
                    alt={`${payment.Lease.Listing.title}'s photo`}
                    width={1000}
                    height={1000}
                    className="size-[50px] rounded-md object-cover"
                  />
                  <p className="group-hover:underline group-hover:text-primary transition-all font-medium">
                    {payment.Lease.Listing.title}
                  </p>
                </TableCell>
                <TableCell>{payment.Lease.Listing.User.name}</TableCell>
                <TableCell>
                  {payment.type === "RENT" && "Rent"}
                  {payment.type === "SECURITY_DEPOSIT" && "Security Deposit"}
                  {payment.type === "SERVICE_FEE" && "Service fee"}
                  {payment.type === "OTHER" && "Others"}
                </TableCell>
                <TableCell>
                  <NairaIcon />
                  {payment.amount}
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end">
                    <PaymentActions id={payment.id} payment={payment} />
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
