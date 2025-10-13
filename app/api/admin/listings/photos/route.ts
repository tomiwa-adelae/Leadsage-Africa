import { NextResponse } from "next/server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import {
  deletePhoto,
  markAsCover,
  savePhotos,
} from "@/app/(admin)/admin/listings/[slug]/edit/actions";

// ✅ POST = Save new photos
export async function POST(req: Request) {
  try {
    await requireAdmin();
    const { photos, listingId } = await req.json();

    if (!listingId || !photos) {
      return NextResponse.json(
        { status: "error", message: "Missing photos or listing ID" },
        { status: 400 }
      );
    }

    const result = await savePhotos(photos, listingId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error saving photos:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to save photos" },
      { status: 500 }
    );
  }
}

// ✅ DELETE = Delete a photo
export async function DELETE(req: Request) {
  try {
    await requireAdmin();
    const { photoId, listingId } = await req.json();

    if (!photoId || !listingId) {
      return NextResponse.json(
        { status: "error", message: "Missing photo or listing ID" },
        { status: 400 }
      );
    }

    const result = await deletePhoto(photoId, listingId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error deleting photo:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to delete photo" },
      { status: 500 }
    );
  }
}

// ✅ PATCH = Mark a photo as cover
export async function PATCH(req: Request) {
  try {
    await requireAdmin();
    const { photoId, listingId } = await req.json();

    if (!photoId || !listingId) {
      return NextResponse.json(
        { status: "error", message: "Missing photo or listing ID" },
        { status: 400 }
      );
    }

    const result = await markAsCover(photoId, listingId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error marking photo as cover:", error);
    return NextResponse.json(
      { status: "error", message: "Failed to mark as cover" },
      { status: 500 }
    );
  }
}
