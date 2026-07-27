export type GalleryLayout = "portrait" | "landscape" | "wide";
export type GalleryLocale = "en" | "tr";

export interface PublicGalleryTranslation {
  locale: GalleryLocale;
  category: string;
  place: string;
  caption: string;
  imageAlt: string;
}

export interface PublicGalleryItem {
  id: string;
  imageUrl: string;
  layout: GalleryLayout;
  sortOrder: number;
  galleryTranslations: PublicGalleryTranslation[];
}

export const bundledGalleryItems: PublicGalleryItem[] = [
  {
    id: "gallery_ramadan_iftar_wide",
    imageUrl: "/images/field-ramadan-iftar-wide.webp",
    layout: "portrait",
    sortOrder: 0,
    galleryTranslations: [
      {
        locale: "en",
        category: "Ramadan programme",
        place: "Pakistan · 2026",
        caption:
          "Hundreds of community members gather for an IHBA Ramadan iftar in Pakistan.",
        imageAlt:
          "A large Ramadan iftar gathering beside an IHBA banner in Pakistan",
      },
      {
        locale: "tr",
        category: "Ramazan programı",
        place: "Pakistan · 2026",
        caption:
          "Yüzlerce kişi Pakistan'da IHBA tarafından düzenlenen Ramazan iftarında bir araya geliyor.",
        imageAlt:
          "Pakistan'da IHBA afişinin yanında düzenlenen kalabalık Ramazan iftarı",
      },
    ],
  },
  {
    id: "gallery_solar_water_pump",
    imageUrl: "/images/field-solar-water-pump.webp",
    layout: "portrait",
    sortOrder: 1,
    galleryTranslations: [
      {
        locale: "en",
        category: "Sustainable development",
        place: "Pakistan",
        caption:
          "A solar-powered pump brings groundwater into a village channel, supporting dependable local access.",
        imageAlt:
          "Solar panels powering a water pump in a rural village in Pakistan",
      },
      {
        locale: "tr",
        category: "Sürdürülebilir kalkınma",
        place: "Pakistan",
        caption:
          "Güneş enerjili pompa, yer altı suyunu köy kanalına taşıyarak güvenilir yerel erişimi destekliyor.",
        imageAlt:
          "Pakistan'daki kırsal bir köyde su pompasını çalıştıran güneş panelleri",
      },
    ],
  },
  {
    id: "gallery_ramadan_iftar",
    imageUrl: "/images/field-ramadan-iftar.webp",
    layout: "portrait",
    sortOrder: 2,
    galleryTranslations: [
      {
        locale: "en",
        category: "Humanitarian assistance",
        place: "Pakistan · 2026",
        caption:
          "An IHBA Ramadan table stretches through the community as guests break their fast together.",
        imageAlt:
          "Community members seated along a long Ramadan iftar table in Pakistan",
      },
      {
        locale: "tr",
        category: "İnsani yardım",
        place: "Pakistan · 2026",
        caption:
          "IHBA Ramazan sofrası boyunca topluluk üyeleri birlikte oruçlarını açıyor.",
        imageAlt:
          "Pakistan'da uzun bir Ramazan iftar sofrasında oturan topluluk üyeleri",
      },
    ],
  },
  {
    id: "gallery_field_team",
    imageUrl: "/images/field-team-pakistan.webp",
    layout: "landscape",
    sortOrder: 3,
    galleryTranslations: [
      {
        locale: "en",
        category: "People in the field",
        place: "Pakistan",
        caption:
          "IHBA volunteers and local partners together after field work in Pakistan.",
        imageAlt:
          "IHBA volunteers and local partners standing together at a field site in Pakistan",
      },
      {
        locale: "tr",
        category: "Sahadaki insanlar",
        place: "Pakistan",
        caption:
          "IHBA gönüllüleri ve yerel paydaşlar Pakistan'daki saha çalışmasının ardından bir arada.",
        imageAlt:
          "Pakistan'daki saha alanında birlikte duran IHBA gönüllüleri ve yerel paydaşlar",
      },
    ],
  },
  {
    id: "gallery_clean_water_opening",
    imageUrl: "/images/field-clean-water-opening.webp",
    layout: "wide",
    sortOrder: 4,
    galleryTranslations: [
      {
        locale: "en",
        category: "Clean water",
        place: "Pakistan · 2025",
        caption:
          "Families and community members mark the opening of a donor-supported clean-water well.",
        imageAlt:
          "Families gathered around a newly opened clean-water well in Pakistan",
      },
      {
        locale: "tr",
        category: "Temiz su",
        place: "Pakistan · 2025",
        caption:
          "Aileler ve topluluk üyeleri, bağışçıların desteğiyle açılan temiz su kuyusunu birlikte karşılıyor.",
        imageAlt:
          "Pakistan'da yeni açılan temiz su kuyusunun çevresinde toplanan aileler",
      },
    ],
  },
];
