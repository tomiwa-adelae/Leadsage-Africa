import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { PaymentInterface } from "./_components/PaymentInterface";

interface Props {
  searchParams: Promise<{ token?: string; id?: string }>;
}

export default async function ShortletPaymentPage({ searchParams }: Props) {
  const params = await searchParams;
  const { token, id } = params;

  if (!token || !id) {
    notFound();
  }

  // Validate token and fetch booking
  const booking = await prisma.shortletBooking.findUnique({
    where: {
      id,
      paymentToken: token,
    },
    include: {
      User: {
        select: {
          id: true,
          name: true,
          email: true,
          phoneNumber: true,
          kycTier: true,
        },
      },
      Listing: {
        select: {
          id: true,
          title: true,
          slug: true,
          address: true,
          city: true,
          state: true,
          country: true,
          price: true,
          photos: {
            where: { cover: true },
            select: { src: true },
            take: 1,
          },
        },
      },
    },
  });

  // Validation checks
  if (!booking) {
    notFound();
  }

  // Check if token has expired
  if (
    booking.paymentTokenExpiry &&
    new Date() > new Date(booking.paymentTokenExpiry)
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full bg-white dark:bg-neutral-900 rounded-md shadow-lg p-8 text-center">
          <div className="text-red-500 text-6xl mb-4">⏰</div>
          <h1 className="text-2xl font-bold mb-2">Payment Link Expired</h1>
          <p className="text-muted-foreground mb-6">
            This payment link has expired. Please contact support for
            assistance.
          </p>
          <a
            href="/contact"
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
          >
            Contact Support
          </a>
        </div>
      </div>
    );
  }

  // Check if already paid
  if (booking.status === "PAID" || booking.status === "CONFIRMED") {
    redirect(`/bookings/shortlets/${booking.id}`);
  }

  // Check if booking is not awaiting payment
  if (booking.status !== "AWAITING_PAYMENT") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full bg-white dark:bg-neutral-900 rounded-md shadow-lg p-8 text-center">
          <div className="text-yellow-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold mb-2">Payment Not Available</h1>
          <p className="text-muted-foreground mb-6">
            This booking is not ready for payment. Status: {booking.status}
          </p>
          <a
            href="/dashboard"
            className="inline-block bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90"
          >
            Go to Dashboard
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 container">
      <PaymentInterface booking={booking} />
    </div>
  );
}
