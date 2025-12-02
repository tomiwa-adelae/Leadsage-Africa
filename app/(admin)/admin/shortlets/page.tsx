import { requireAdmin } from "@/app/data/admin/require-admin";
import { ShortletsTable } from "./_components/ShortletsTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { prisma } from "@/lib/db";
import { SiteHeader } from "@/components/sidebar/site-header";
import { Searchbar } from "@/components/Searchbar";
import { PageHeader } from "@/components/PageHeader";

interface Props {
  searchParams: any;
}

export default async function page({ searchParams }: Props) {
  const { query, page } = await searchParams;
  await requireAdmin();

  // Fetch all shortlet bookings with counts
  const [pending, awaitingPayment, paid, rejected, cancelled, all] =
    await Promise.all([
      prisma.shortletBooking.findMany({
        where: { status: "PENDING" },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              image: true,
            },
          },
          Listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              state: true,
              photos: {
                where: { cover: true },
                select: { src: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.shortletBooking.findMany({
        where: { status: "AWAITING_PAYMENT" },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              image: true,
            },
          },
          Listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              state: true,
              photos: {
                where: { cover: true },
                select: { src: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.shortletBooking.findMany({
        where: {
          status: { in: ["PAID", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT"] },
        },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              image: true,
            },
          },
          Listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              state: true,
              photos: {
                where: { cover: true },
                select: { src: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.shortletBooking.findMany({
        where: { status: "REJECTED" },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              image: true,
            },
          },
          Listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              state: true,
              photos: {
                where: { cover: true },
                select: { src: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.shortletBooking.findMany({
        where: { status: "CANCELLED" },
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              image: true,
            },
          },
          Listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              state: true,
              photos: {
                where: { cover: true },
                select: { src: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.shortletBooking.findMany({
        include: {
          User: {
            select: {
              id: true,
              name: true,
              email: true,
              phoneNumber: true,
              image: true,
            },
          },
          Listing: {
            select: {
              id: true,
              title: true,
              slug: true,
              city: true,
              state: true,
              photos: {
                where: { cover: true },
                select: { src: true },
                take: 1,
              },
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6 space-y-4">
        <PageHeader
          title={"Shortlet Bookings"}
          description={"Manage shortlet booking requests and confirmations."}
        />
        <Searchbar
          search={query}
          placeholder="Search by title, descriptions..."
        />

        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending {pending.length > 0 && `(${pending.length})`}
            </TabsTrigger>
            <TabsTrigger value="awaiting-payment">
              Awaiting Payment{" "}
              {awaitingPayment.length > 0 && `(${awaitingPayment.length})`}
            </TabsTrigger>
            <TabsTrigger value="paid">
              Paid {paid.length > 0 && `(${paid.length})`}
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected {rejected.length > 0 && `(${rejected.length})`}
            </TabsTrigger>
            <TabsTrigger value="cancelled">
              Cancelled {cancelled.length > 0 && `(${cancelled.length})`}
            </TabsTrigger>
            <TabsTrigger value="all">
              All {all.length > 0 && `(${all.length})`}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            <ShortletsTable bookings={pending} showActions />
          </TabsContent>

          <TabsContent value="awaiting-payment" className="space-y-4">
            <ShortletsTable bookings={awaitingPayment} />
          </TabsContent>

          <TabsContent value="paid" className="space-y-4">
            <ShortletsTable bookings={paid} />
          </TabsContent>

          <TabsContent value="rejected" className="space-y-4">
            <ShortletsTable bookings={rejected} />
          </TabsContent>

          <TabsContent value="cancelled" className="space-y-4">
            <ShortletsTable bookings={cancelled} />
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            <ShortletsTable bookings={all} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
