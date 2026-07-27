import { db } from "../lib/db/client";
import {
  galleryItems,
  galleryTranslations,
} from "../lib/db/schema";
import { bundledGalleryItems } from "../lib/gallery";

async function main() {
  for (const item of bundledGalleryItems) {
    await db
      .insert(galleryItems)
      .values({
        id: item.id,
        state: "published",
        imageUrl: item.imageUrl,
        imagePublicId: null,
        layout: item.layout,
        sortOrder: item.sortOrder,
      })
      .onConflictDoNothing();

    for (const translation of item.galleryTranslations) {
      await db
        .insert(galleryTranslations)
        .values({ galleryId: item.id, ...translation })
        .onConflictDoNothing();
    }
  }

  console.log(`Seeded ${bundledGalleryItems.length} gallery items.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
