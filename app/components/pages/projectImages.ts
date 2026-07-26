/**
 * Imagery keyed by project slug, shared between the projects index and the
 * detail pages so both always show the same photograph for a project.
 */
export const projectImages: Record<string, { src: string; alt: string }> = {
  "mazar-i-sharif-education-centre": {
    src: "/images/generated/project-education-centre.webp",
    alt: "Teacher guiding girls and boys as they study together in a classroom",
  },
  "pakistan-student-support": {
    src: "/images/generated/project-student-support.webp",
    alt: "University students reviewing applications together on campus",
  },
  "ramadan-qurban-programmes": {
    src: "/images/generated/project-ramadan-programme.webp",
    alt: "Community volunteers preparing food and shared meals together",
  },
};

/** Slugs are the routing contract, so they live outside the translated copy. */
export const projectSlugs = Object.keys(projectImages);

export function resolveProjectImage(project: {
  slug: string;
  image?: { src: string; alt: string };
}) {
  return (
    project.image ??
    projectImages[project.slug] ?? {
      src: "/images/hero-light.svg",
      alt: project.slug,
    }
  );
}
