"use server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin();

    const booking = await prisma.shortletBooking.findUnique({
      where: { id: params.id },
      include: {
        User: {
          select: {
            id: true,
            name: true,
            email: true,
            phoneNumber: true,
            image: true,
            address: true,
            city: true,
            state: true,
            country: true,
          },
        },
        Listing: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            smallDescription: true,
            address: true,
            city: true,
            state: true,
            country: true,
            price: true,
            bedrooms: true,
            bathrooms: true,
            propertySize: true,
            photos: {
              select: {
                id: true,
                src: true,
                cover: true,
              },
            },
            amenities: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
            User: {
              select: {
                id: true,
                name: true,
                email: true,
                phoneNumber: true,
              },
            },
          },
        },
      },
    });

    if (!booking) {
      return NextResponse.json(
        { error: "Booking not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      booking,
    });
  } catch (error) {
    console.error("Error fetching shortlet booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 }
    );
  }
}
