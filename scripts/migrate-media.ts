import { resolve } from "path";
import { v2 as cloudinary } from "cloudinary";
import { eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import { projects, siteMedia } from "../lib/db/schema";
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
  key: SiteMediaKey;
  filename: string;
  publicId: string;
  projectSlug?: string;
}> = [
  {
    key: "hero",
    filename: "ihba-hero.webp",
    publicId: "ihba/site/hero",
  },
  {
    key: "educationCentre",
    filename: "project-education-centre.webp",
    publicId: "ihba/site/education-centre",
    projectSlug: "mazar-i-sharif-education-centre",
  },
  {
    key: "ramadanProgramme",
    filename: "project-ramadan-programme.webp",
    publicId: "ihba/site/ramadan-programme",
    projectSlug: "ramadan-qurban-programmes",
  },
  {
    key: "studentSupport",
    filename: "project-student-support.webp",
    publicId: "ihba/site/student-support",
    projectSlug: "pakistan-student-support",
  },
  {
    key: "volunteerTeam",
    filename: "volunteer-team.webp",
    publicId: "ihba/site/volunteer-team",
  },
];

async function main() {
  for (const asset of assets) {
    const result = await cloudinary.uploader.upload(
      resolve("public", "images", "generated", asset.filename),
      {
        public_id: asset.publicId,
        overwrite: true,
        invalidate: true,
        resource_type: "image",
      }
    );

    await db
      .insert(siteMedia)
      .values({
        key: asset.key,
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

    console.log(`Migrated ${asset.key}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
