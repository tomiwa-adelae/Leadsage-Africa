// prisma/seed.ts
import { listingAmenities, listingCategories } from "@/constants";
import { prisma } from "@/lib/db";
import { PrismaClient } from "@/lib/generated/prisma";
import { v4 as uuidv4 } from "uuid";

// const prisma = new PrismaClient();

async function main() {
	for (const category of listingCategories) {
		await prisma.category.upsert({
			where: { id: category.id },
			update: {},
			create: category,
		});
	}

	for (const amenity of listingAmenities) {
		await prisma.amenities.upsert({
			where: { id: amenity.id },
			update: {},
			create: amenity,
		});
	}

	console.log("✅ Categories seeded.");
	console.log("✅ Amenities seeded.");
}

main()
	.catch((e) => {
		console.error("❌ Seeding error:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
