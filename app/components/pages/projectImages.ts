/**
 * Imagery keyed by project slug, shared between the projects index and the
 * detail pages so both always show the same photograph for a project.
 */
type ProjectPhoto = { src: string; alt: string };

/*
  Typed as possibly-missing on purpose: a slug with no bundled photograph
  returns undefined at runtime, and without this the compiler would let callers
  read `.src` off nothing.
*/
export const projectImages: Record<string, ProjectPhoto | undefined> = {
  "mazar-i-sharif-education-centre": {
    src: "/images/generated/project-education-centre.webp",
    alt: "Teacher guiding girls and boys as they study together in a classroom",
  },
  "pakistan-student-support": {
    src: "/images/generated/project-student-support.webp",
    alt: "University students reviewing applications together on campus",
  },
  "ramadan-qurban-programmes": {
    src: "/images/field-ramadan-iftar-wide.webp",
    alt: "A large IHBA Ramadan iftar gathering in Pakistan",
  },
};

/** Slugs are the routing contract, so they live outside the translated copy. */
export const projectSlugs = Object.keys(projectImages);

/**
 * Resolves a project's photograph, or `undefined` when it genuinely has none.
 *
 * There is deliberately no generic fallback graphic: a project published
 * without a picture should read as a clean text card, not as a broken one
 * wearing a stock placeholder. Callers are expected to omit the image element
 * entirely when this returns nothing.
 */
export function resolveProjectImage(project: {
  slug: string;
  image?: { src: string; alt: string };
}) {
  const legacyRamadanImage =
    project.slug === "ramadan-qurban-programmes" &&
    project.image?.src === "/images/generated/project-ramadan-programme.webp";

  return (
    (!legacyRamadanImage ? project.image : undefined) ??
    projectImages[project.slug]
  );
}
