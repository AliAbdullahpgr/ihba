export const bundledMedia = {
  hero: {
    url: "/images/generated/ihba-hero.webp",
    publicId: "",
  },
  educationCentre: {
    url: "/images/generated/project-education-centre.webp",
    publicId: "",
  },
  ramadanProgramme: {
    url: "/images/generated/project-ramadan-programme.webp",
    publicId: "",
  },
  studentSupport: {
    url: "/images/generated/project-student-support.webp",
    publicId: "",
  },
  volunteerTeam: {
    url: "/images/generated/volunteer-team.webp",
    publicId: "",
  },
};

export type SiteMedia = typeof bundledMedia;
export type SiteMediaKey = keyof SiteMedia;

export const mediaLabels: Record<SiteMediaKey, string> = {
  hero: "Homepage and about hero",
  educationCentre: "Education centre",
  ramadanProgramme: "Ramadan programme",
  studentSupport: "Student support",
  volunteerTeam: "Volunteer team",
};
