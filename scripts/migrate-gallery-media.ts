import { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";
import { eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import {
  galleryItems,
  projects,
  siteMedia,
} from "../lib/db/schema";
import type { SiteMediaKey } from "../lib/media";

const required = (
  name:
    | "CLOUDINARY_CLOUD_NAME"
    | "CLOUDINARY_API_KEY"
    | "CLOUDINARY_API_SECRET"
) => {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is required`);
  return value;
};

cloudinary.config({
  cloud_name: required("CLOUDINARY_CLOUD_NAME"),
  api_key: required("CLOUDINARY_API_KEY"),
  api_secret: required("CLOUDINARY_API_SECRET"),
  secure: true,
});

const assets: Array<{
  filename: string;
  publicId: string;
  galleryId?: string;
  mediaKey?: SiteMediaKey;
  projectSlug?: string;
}> = [
  {
    filename: "president-abdullah-serenli.webp",
    publicId: "ihba/site/president-abdullah-serenli",
    mediaKey: "presidentPortrait",
  },
  {
    filename: "field-ramadan-iftar-wide.webp",
    publicId: "ihba/gallery/ramadan-iftar-wide",
    galleryId: "gallery_ramadan_iftar_wide",
    mediaKey: "fieldRamadanIftar",
    projectSlug: "ramadan-qurban-programmes",
  },
  {
    filename: "field-solar-water-pump.webp",
    publicId: "ihba/gallery/solar-water-pump",
    galleryId: "gallery_solar_water_pump",
    mediaKey: "solarWaterPump",
  },
  {
    filename: "field-ramadan-iftar.webp",
    publicId: "ihba/gallery/ramadan-iftar",
    galleryId: "gallery_ramadan_iftar",
    mediaKey: "ramadanProgrammeAlternate",
  },
  {
    filename: "field-team-pakistan.webp",
    publicId: "ihba/gallery/field-team-pakistan",
    galleryId: "gallery_field_team",
    mediaKey: "fieldTeamPakistan",
  },
  {
    filename: "field-clean-water-opening.webp",
    publicId: "ihba/gallery/clean-water-opening",
    galleryId: "gallery_clean_water_opening",
    mediaKey: "cleanWaterOpening",
  },
];

async function main() {
  for (const asset of assets) {
    const result = await cloudinary.uploader.upload(
      resolve("public", "images", asset.filename),
      {
        public_id: asset.publicId,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
      }
    );

    if (asset.galleryId) {
      await db
        .update(galleryItems)
        .set({
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
          updatedAt: new Date(),
        })
        .where(eq(galleryItems.id, asset.galleryId));
    }

    if (asset.mediaKey) {
      await db
        .insert(siteMedia)
        .values({
          key: asset.mediaKey,
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
        })
        .onConflictDoUpdate({
          target: siteMedia.key,
          set: {
            imageUrl: result.secure_url,
            imagePublicId: result.public_id,
            updatedAt: new Date(),
          },
        });
    }

    if (asset.projectSlug) {
      await db
        .update(projects)
        .set({
          imageUrl: result.secure_url,
          imagePublicId: result.public_id,
          updatedAt: new Date(),
        })
        .where(eq(projects.slug, asset.projectSlug));
    }

    console.log(`Migrated ${asset.publicId}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
