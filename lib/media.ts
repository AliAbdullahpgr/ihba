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
    url: "/images/field-ramadan-iftar-wide.webp",
    publicId: "",
  },
  fieldRamadanIftar: {
    url: "/images/field-ramadan-iftar-wide.webp",
    publicId: "",
  },
  ramadanProgrammeAlternate: {
    url: "/images/field-ramadan-iftar.webp",
    publicId: "",
  },
  solarWaterPump: {
    url: "/images/field-solar-water-pump.webp",
    publicId: "",
  },
  cleanWaterOpening: {
    url: "/images/field-clean-water-opening.webp",
    publicId: "",
  },
  studentSupport: {
    url: "/images/generated/project-student-support.webp",
    publicId: "",
  },
  volunteerTeam: {
    url: "/images/field-team-pakistan.webp",
    publicId: "",
  },
  fieldTeamPakistan: {
    url: "/images/field-team-pakistan.webp",
    publicId: "",
  },
  presidentPortrait: {
    url: "/images/president-abdullah-serenli.webp",
    publicId: "",
  },
};

export type SiteMedia = typeof bundledMedia;
export type SiteMediaKey = keyof SiteMedia;

export const mediaLabels: Record<SiteMediaKey, string> = {
  hero: "Homepage and about hero",
  educationCentre: "Education centre",
  ramadanProgramme: "Ramadan programme",
  fieldRamadanIftar: "Ramadan iftar field photograph",
  ramadanProgrammeAlternate: "Ramadan programme (alternate)",
  solarWaterPump: "Solar-powered water pump",
  cleanWaterOpening: "Clean-water opening",
  studentSupport: "Student support",
  volunteerTeam: "Volunteer team",
  fieldTeamPakistan: "IHBA field team in Pakistan",
  presidentPortrait: "President portrait",
};

/** Where each shared image appears, so editors can choose the right asset. */
export const mediaUsage: Record<SiteMediaKey, string> = {
  hero: "Homepage hero and About page introduction",
  educationCentre: "Areas of work: education",
  ramadanProgramme: "Project and programme feature sections",
  fieldRamadanIftar: "Homepage focus mosaic and Donate page",
  ramadanProgrammeAlternate: "Programme detail alternate image",
  solarWaterPump: "Homepage focus mosaic and water programme sections",
  cleanWaterOpening: "Homepage focus mosaic and water programme sections",
  studentSupport: "Homepage focus mosaic and education sections",
  volunteerTeam: "Volunteer and programme sections",
  fieldTeamPakistan: "Homepage call to action and Volunteer page",
  presidentPortrait: "Homepage president message and President's Message page",
};
