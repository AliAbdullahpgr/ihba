export type Lang = "en" | "tr";

/** Stable, language-independent keys used for filtering the focus mosaic. */
export type CategoryKey = "relief" | "education" | "development" | "community";

export interface ProgramCard {
  title: string;
  blurb: string;
  categoryKey: CategoryKey;
  /**
   * The card's own photograph, uploaded from the homepage layout editor. The
   * homepage used to take its three area images from a hardcoded list keyed by
   * position, so choosing different areas kept showing the same pictures.
   * Cards without an upload still fall back to those bundled photographs.
   */
  imageUrl?: string;
  imagePublicId?: string;
  /** Describes the photograph for screen readers and search engines. */
  imageAlt?: string;
}

export interface FilterOption {
  key: CategoryKey | "all";
  label: string;
}

export interface Signpost {
  title: string;
  copy: string;
  cta: string;
}

/**
 * A figure in the facts strip.
 *
 * `derive` makes the number read itself off the content it is describing, so a
 * stat can never contradict the grid below it. Editing the programmes list used
 * to leave "7 Areas of work" behind as a hand-typed string; now that string is
 * only the fallback for figures nothing in the content can count — the founding
 * year, the continent count.
 */
export interface StatItem {
  value: string;
  label: string;
  derive?: "areas" | "projects";
}

export interface ApproachStep {
  title: string;
  text: string;
}

export interface ProjectCard {
  badgeKey: "planning" | "active" | "seasonal";
  badge: string;
  region: string;
  title: string;
  summary: string;
  chips: string[];
}

export interface FooterColumn {
  header: string;
  links: string[];
}

export interface TitleParts {
  pre: string;
  highlight: string;
  post: string;
}

/**
 * One frame of the homepage hero carousel. Every banner is an entry here,
 * including the first — see `lib/hero-slides.ts` for the fallback that
 * rebuilds it from the legacy `hero` block on documents saved before that.
 * `imageKey` resolves against `t.media` so the asset stays swappable from the
 * media admin without re-editing copy.
 */
export interface HeroSlide {
  /** Stable key used by the admin editor and the recoverable trash flow. */
  id?: string;
  headline: TitleParts;
  subcopy: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  imageKey: string;
  /** Optional per-slide upload, overriding the bundled media key. */
  imageUrl?: string;
  imagePublicId?: string;
  /**
   * Describes the photograph for screen readers and search engines. Uploaded
   * images have no description until someone writes one, so this is edited
   * alongside the copy rather than derived from the file.
   */
  alt?: string;
  /** Hidden slides remain editable but are not rendered publicly. */
  active?: boolean;
}

export type SocialProfileKey = "instagram" | "facebook" | "youtube" | "twitter" | "linkedin";

export interface SocialProfile {
  /**
   * Chooses the icon. Widened from the original five-platform union so new
   * platforms can be added from the admin as data rather than as a code
   * change; anything unrecognised renders a generic link mark.
   */
  key: string;
  /** Accessible name; falls back to the built-in name for known platforms. */
  label?: string;
  url: string;
  active: boolean;
  openInNewTab?: boolean;
}

export interface Campaign {
  kicker: string;
  title: TitleParts;
  copy: string;
  ctaPrimary: string;
  ctaPrimaryHref: string;
  ctaSecondary: string;
  ctaSecondaryHref: string;
  goalLabel: string;
  goalValue: string;
  /** Bundled media key, used when no image has been uploaded for the band. */
  imageKey: string;
  /** Overrides `imageKey` once someone uploads a photograph of their own. */
  imageUrl?: string;
  imagePublicId?: string;
}

export interface Dictionary {
  utility: {
    tagline: string;
    email: string;
    phone: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  socialLinks: SocialProfile[];
  hero: {
    /*
      The conviction is the headline; this is the sentence that used to introduce
      it. Kept as a standfirst above the h1 so the idea leads and the setup still
      gets said, rather than spending the first fifty characters of display type
      clearing its throat.
    */
    standfirst: string;
    headline: TitleParts;
    subcopy: string;
    ctaPrimary: string;
    ctaSecondary: string;
    chips: string[];
    feature: {
      tag: string;
      title: string;
      copy: string;
      cta: string;
    };
  };
  /** Additional hero carousel slides; slide 0 is built from `hero` at render. */
  heroSlides: HeroSlide[];
  /** Recoverable banner records kept out of the public carousel. */
  heroSlidesTrash: Array<HeroSlide & { deletedAt: string }>;
  /**
   * Which items the curated homepage sections show, chosen in the homepage
   * layout editor. An empty list means "decide automatically" — the newest
   * news, the first projects, the first areas — so the homepage works before
   * anyone curates it and keeps working when a chosen item is unpublished.
   *
   * Selections are the same in every language and the save action writes them
   * to both documents, so a slug chosen in Turkish is not missing in English.
   */
  homepage: {
    /** News article slugs. */
    news: string[];
    /** Project slugs. */
    projects: string[];
    /** Indices into `programs.cards`, which have no stable identifier. */
    areas: number[];
  };
  ticker: {
    items: string[];
  };
  facts: {
    /** Names the strip for assistive tech; the figures carry it visually. */
    title: string;
    stats: StatItem[];
  };
  about: {
    title: string;
    lede: string;
    ledeExtra: string;
    missionLabel: string;
    missionText: string;
    visionLabel: string;
    visionText: string;
    valuesLabel: string;
    values: string[];
  };
  programs: {
    title: TitleParts;
    filterLabel: string;
    filters: FilterOption[];
    cards: ProgramCard[];
    signposts: Signpost[];
    viewAll: string;
  };
  projects: {
    title: string;
    lede: string;
    browseAll: string;
    cards: ProjectCard[];
  };
  approach: {
    title: string;
    steps: ApproachStep[];
  };
  presidentQuote: {
    quote: string;
    name: string;
    role: string;
  };
  volunteer: {
    title: TitleParts;
    copy: string;
    ctaPrimary: string;
    ctaSecondary: string;
    note: string;
  };
  newsletter: {
    socialTitle: string;
    title: string;
    copy: string;
    placeholder: string;
    subscribeLabel: string;
    success: string;
  };
  /** Homepage "latest news" summary header. Empty state reuses `newsPage`. */
  latestNews: {
    title: string;
    viewAll: string;
  };
  /** Featured donation appeal. Editable via the admin content editor. */
  campaign: Campaign;
  /** Homepage contact summary section, before the global footer. */
  contactSection: {
    title: string;
    lede: string;
    cta: string;
  };
  footer: {
    addressLine: string;
    columns: FooterColumn[];
    contactLabel: string;
    reportTitle: string;
    reportCopy: string;
    copyright: string;
    transparency: string;
  };
}

export const dict: Record<Lang, Dictionary> = {
  en: {
    utility: {
      tagline: "A Bridge for Humanity",
      email: "info@insanlikkoprusu.org",
      phone: "+90 533 620 63 74",
    },
    social: {
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "X",
      linkedin: "LinkedIn",
      youtube: "YouTube",
    },
    socialLinks: [
      { key: "instagram", url: "", active: false },
      { key: "facebook", url: "", active: false },
      { key: "youtube", url: "", active: false },
      { key: "twitter", url: "", active: false },
      { key: "linkedin", url: "", active: false },
    ],
    hero: {
      standfirst: "At the heart of everything we do is one conviction",
      headline: {
        pre: "Dignity is not given, it is",
        highlight: "built together.",
        post: "",
      },
      subcopy:
        "IHBA connects humanitarian assistance with education, sustainable development and strong institutional partnerships to build lasting bridges of compassion across regions.",
      ctaPrimary: "Donate",
      ctaSecondary: "Our Work",
      chips: ["Founded 2025", "Istanbul, Türkiye", "Asia & Africa focus"],
      feature: {
        tag: "Our story",
        title: "The IHBA Bridge: Our People, Our Projects",
        copy:
          "A growing record of the students, families and communities on both sides of every bridge we build.",
        cta: "Learn more",
      },
    },
    heroSlides: [
      {
        headline: {
          pre: "Where the need is, ",
          highlight: "we are.",
          post: "",
        },
        subcopy:
          "From Ramadan iftar tables in Pakistan to education centres taking shape in Afghanistan, IHBA works where urgent need and long-term opportunity meet.",
        ctaPrimary: "Our work",
        ctaPrimaryHref: "/areas-of-work",
        ctaSecondary: "Latest news",
        ctaSecondaryHref: "/news",
        imageKey: "heroSlide2",
      },
      {
        headline: {
          pre: "Build the bridge, ",
          highlight: "be the pier.",
          post: "",
        },
        subcopy:
          "Volunteers, donors and partners make every IHBA programme possible. Whatever you bring — time, skills, or a gift — we make sure it reaches the other side.",
        ctaPrimary: "Volunteer",
        ctaPrimaryHref: "/volunteer",
        ctaSecondary: "Donate",
        ctaSecondaryHref: "/donate",
        imageKey: "heroSlide3",
      },
    ],
    heroSlidesTrash: [],
    homepage: { news: [], projects: [], areas: [] },
    ticker: {
      items: [
        "HUMANITARIAN AID",
        "EDUCATION",
        "SUSTAINABLE DEVELOPMENT",
        "CHILDREN YOUTH & WOMEN",
        "HEALTH & SOCIAL SUPPORT",
        "CULTURE ARTS & VOLUNTEERING",
        "INSTITUTIONAL COOPERATION",
      ],
    },
    facts: {
      title: "IHBA at a glance",
      stats: [
        { value: "2025", label: "Founded in Istanbul" },
        { value: "7", label: "Areas of work", derive: "areas" },
        { value: "3", label: "Ongoing programmes", derive: "projects" },
        { value: "2", label: "Continent focus" },
      ],
    },
    about: {
      title: "About IHBA",
      lede:
        "An international civil society organisation founded in Istanbul, working where urgent need and long-term opportunity meet.",
      ledeExtra:
        "Since 2025, we've grown from emergency relief into a wider mission spanning education, sustainable development and cross-border cooperation — always working through trusted local partners who understand the realities on the ground.",
      missionLabel: "Our Mission",
      missionText:
        "To help meet essential humanitarian needs in both ordinary and emergency situations; to improve the living conditions of children, young people, women, older persons, students and disadvantaged communities through education, social support and sustainable development programmes; and to develop lasting solutions that protect human dignity, rights and freedoms.",
      visionLabel: "Our Vision",
      visionText:
        "To become a trusted international civil society organisation recognised for sustainable projects that empower people, strong cross-continental representation and cooperation networks, and exemplary work in humanitarian assistance, education and development.",
      valuesLabel: "Our Core Values",
      values: [
        "Human dignity",
        "Justice & fairness",
        "Compassion & solidarity",
        "Transparency & accountability",
        "Sustainability",
        "Institutional cooperation",
        "Volunteerism",
      ],
    },
    programs: {
      title: {
        pre: "Seven fields, one purpose: ",
        highlight: "human dignity.",
        post: "",
      },
      filterLabel: "I'm interested in",
      filters: [
        { key: "all", label: "All our work" },
        { key: "relief", label: "Aid & relief" },
        { key: "education", label: "Education" },
        { key: "development", label: "Development" },
        { key: "community", label: "Community" },
      ],
      cards: [
        {
          title: "Humanitarian Assistance",
          blurb: "Food, shelter, health, essential needs, in-kind and financial support.",
          categoryKey: "relief",
        },
        {
          title: "Education",
          blurb: "Scholarships, student support, education centres, guidance.",
          categoryKey: "education",
        },
        {
          title: "Sustainable Development",
          blurb: "Long-term programmes building productive capacity and economic independence.",
          categoryKey: "development",
        },
        {
          title: "Children, Youth & Women",
          blurb: "Protective and developmental education, social support and skills programmes.",
          categoryKey: "community",
        },
        {
          title: "Health & Social Support",
          blurb: "Support for people in need, disaster-affected, displaced, elderly, disabled and orphans.",
          categoryKey: "relief",
        },
        {
          title: "Culture, Arts & Volunteering",
          blurb: "Activities strengthening solidarity and volunteer participation.",
          categoryKey: "community",
        },
        {
          title: "Institutional Cooperation",
          blurb: "Joint projects with institutions and universities across countries.",
          categoryKey: "development",
        },
      ],
      signposts: [
        {
          title: "More from the field",
          copy: "Reports and updates from the regions where our programmes run.",
          cta: "Read field notes",
        },
        {
          title: "What's happening at IHBA",
          copy: "Volunteer calls, seasonal campaigns, partner events and student intakes.",
          cta: "See what's on",
        },
      ],
      viewAll: "View all areas of work",
    },
    projects: {
      title: "We're building three bridges.",
      lede:
        "There's a lot going on throughout the year at IHBA. Here's some of what we're building right now.",
      browseAll: "Browse all projects",
      cards: [
        {
          badgeKey: "planning",
          badge: "Planning stage",
          region: "Afghanistan",
          title: "Mazar-i-Sharif Education Centre",
          summary:
            "A quality education campus for girls and boys aged 7-18. Land purchased; official preparations under way.",
          chips: ["~1,000 students", "Target 2027"],
        },
        {
          badgeKey: "active",
          badge: "Active",
          region: "Pakistan",
          title: "Pakistan Student Support Programme",
          summary:
            "Guiding students from Türkiye to Pakistan through university selection, applications, scholarships and housing.",
          chips: ["Scholarships", "Housing", "Guidance"],
        },
        {
          badgeKey: "seasonal",
          badge: "Seasonal",
          region: "Asia & Africa",
          title: "Ramadan & Qurban Programmes",
          summary:
            "Iftar programmes, food support and Qurban organisation in Pakistan, Afghanistan, Palestine and Africa.",
          chips: ["Iftar", "Food", "Qurban"],
        },
      ],
    },
    approach: {
      title: "How we work",
      steps: [
        {
          title: "Urgent aid, lasting development",
          text: "We combine emergency relief with long-term education and development programmes.",
        },
        {
          title: "Designed around local realities",
          text: "Every project is planned around the region's actual needs.",
        },
        {
          title: "Trusted field partners",
          text: "We deliver through local partners who know their communities.",
        },
        {
          title: "Cross-border cooperation",
          text: "Representations and institutional partnerships keep our work sustainable.",
        },
      ],
    },
    presidentQuote: {
      quote:
        "We believe that genuine assistance means not only extending a hand today, but also helping to build a stronger tomorrow.",
      name: "Abdullah Serenli",
      role: "Chairman of the Board",
    },
    volunteer: {
      title: {
        pre: "Become a ",
        highlight: "bridge.",
        post: "",
      },
      copy: "Give your time, your skills, or a donation — whatever you bring, we'll make sure it reaches the other side.",
      ctaPrimary: "Donate",
      ctaSecondary: "Become a Volunteer",
      note: "Donation accounts will be published soon — reach us to contribute today.",
    },
    newsletter: {
      socialTitle:
        "Want to see and read even more from us? Our social channels carry the field updates, the student stories and the day-to-day of life at IHBA.",
      title: "Interested in our monthly curation of projects and calls? Sign up for our newsletter.",
      copy: "New projects and field reports, in your inbox.",
      placeholder: "Email",
      subscribeLabel: "Subscribe",
      success: "Thank you — you've been added.",
    },
    latestNews: {
      title: "Latest news",
      viewAll: "View all news",
    },
    campaign: {
      kicker: "Current appeal",
      title: {
        pre: "Build a school. ",
        highlight: "Build a future.",
        post: "",
      },
      copy:
        "The Mazar-i-Sharif Education Centre will give around 1,000 girls and boys a place to learn, eat and grow in safety. The land is bought; construction is next. Your support brings the campus one step closer.",
      ctaPrimary: "Donate to this project",
      ctaPrimaryHref: "/donate",
      ctaSecondary: "Read the project",
      ctaSecondaryHref: "/projects/mazar-i-sharif-education-centre",
      goalLabel: "Target completion",
      goalValue: "End of 2027",
      imageKey: "campaignImage",
    },
    contactSection: {
      title: "Get in touch",
      lede:
        "Questions about donations, partnerships, volunteering or media? We usually reply within a few working days.",
      cta: "Contact us",
    },
    footer: {
      addressLine:
        "Mecidiye Neighbourhood, Süngü Street, Tevhit Çarşısı No: 2/212, Sultanbeyli / Istanbul, Türkiye",
      columns: [
        {
          header: "About",
          links: ["Who we are", "President's Message", "Board of Directors", "Annual Reports"],
        },
        {
          header: "Areas of Work",
          links: ["Humanitarian Aid", "Education", "Sustainable Development", "Health & Social Support"],
        },
        {
          header: "Projects",
          links: [
            "Mazar-i-Sharif Education Centre",
            "Pakistan Student Programme",
            "Ramadan & Qurban Programmes",
          ],
        },
      ],
      contactLabel: "For general inquiries, please contact",
      reportTitle: "Would you like to report a concern?",
      reportCopy:
        "Every donation and project is auditable. Write to us and we will respond within five working days.",
      copyright: "© 2026 IHBA — International Humanity Bridge. All rights reserved.",
      transparency: "Registry No: 34-291-110 · Tax No: 8900485331 · MERSIS: 0890048533100001",
    },
  },
  tr: {
    utility: {
      tagline: "İnsanlık İçin Bir Köprü",
      email: "info@insanlikkoprusu.org",
      phone: "+90 533 620 63 74",
    },
    social: {
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "X",
      linkedin: "LinkedIn",
      youtube: "YouTube",
    },
    socialLinks: [
      { key: "instagram", url: "", active: false },
      { key: "facebook", url: "", active: false },
      { key: "youtube", url: "", active: false },
      { key: "twitter", url: "", active: false },
      { key: "linkedin", url: "", active: false },
    ],
    hero: {
      standfirst: "Yaptığımız her şeyin merkezinde tek bir inanç var",
      headline: {
        pre: "Onur verilmez,",
        highlight: "birlikte inşa edilir.",
        post: "",
      },
      subcopy:
        "IHBA, insani yardımı eğitim, sürdürülebilir kalkınma ve güçlü kurumsal iş birlikleriyle buluşturarak farklı coğrafyalarda kalıcı iyiliğin köprülerini kurar.",
      ctaPrimary: "Bağış Yapın",
      ctaSecondary: "Çalışmalarımız",
      chips: ["2025'te kuruldu", "İstanbul, Türkiye", "Asya ve Afrika odağı"],
      feature: {
        tag: "Hikâyemiz",
        title: "IHBA Köprüsü: İnsanlarımız, Projelerimiz",
        copy:
          "Kurduğumuz her köprünün iki yakasındaki öğrencilerin, ailelerin ve toplulukların büyüyen kaydı.",
        cta: "Daha fazlası",
      },
    },
    heroSlides: [
      {
        headline: {
          pre: "İhtiyaç neredeyse, ",
          highlight: "biz oradayız.",
          post: "",
        },
        subcopy:
          "Pakistan'daki Ramazan iftar sofralarından Afganistan'da şekillenen eğitim merkezlerine kadar, IHBA acil ihtiyaç ile uzun vadeli fırsatın kesiştiği yerde çalışır.",
        ctaPrimary: "Çalışmalarımız",
        ctaPrimaryHref: "/areas-of-work",
        ctaSecondary: "Haberler",
        ctaSecondaryHref: "/news",
        imageKey: "heroSlide2",
      },
      {
        headline: {
          pre: "Köprüyü kur, ",
          highlight: "ayak ol.",
          post: "",
        },
        subcopy:
          "Gönüllüler, bağışçılar ve ortaklar IHBA'nın her programını mümkün kılıyor. Ne sunarsanız sunun — zaman, yetenek ya da bir bağış — karşı kıyıya ulaştırırız.",
        ctaPrimary: "Gönüllü Olun",
        ctaPrimaryHref: "/volunteer",
        ctaSecondary: "Bağış Yapın",
        ctaSecondaryHref: "/donate",
        imageKey: "heroSlide3",
      },
    ],
    heroSlidesTrash: [],
    homepage: { news: [], projects: [], areas: [] },
    ticker: {
      items: [
        "İNSANİ YARDIM",
        "EĞİTİM",
        "SÜRDÜRÜLEBİLİR KALKINMA",
        "ÇOCUK GENÇLİK KADIN",
        "SAĞLIK VE SOSYAL DESTEK",
        "KÜLTÜR SANAT GÖNÜLLÜLÜK",
        "KURUMSAL İŞ BİRLİKLERİ",
      ],
    },
    facts: {
      title: "Bir bakışta IHBA",
      stats: [
        { value: "2025", label: "İstanbul'da kuruldu" },
        { value: "7", label: "Faaliyet alanı", derive: "areas" },
        { value: "3", label: "Devam eden program", derive: "projects" },
        { value: "2", label: "Kıta odağı" },
      ],
    },
    about: {
      title: "IHBA Hakkında",
      lede:
        "İstanbul'da kurulan, acil ihtiyaç ile uzun vadeli fırsatın kesiştiği yerde çalışan uluslararası bir sivil toplum kuruluşu.",
      ledeExtra:
        "2025'ten bu yana acil yardımdan eğitim, sürdürülebilir kalkınma ve sınır ötesi iş birliğine uzanan daha geniş bir misyona doğru büyüdük — her zaman sahayı bilen güvenilir yerel ortaklarla çalışarak.",
      missionLabel: "Misyonumuz",
      missionText:
        "Olağan ve olağanüstü durumlarda temel insani ihtiyaçların karşılanmasına katkı sunmak; eğitim, sosyal destek ve sürdürülebilir kalkınma projeleriyle çocukların, gençlerin, kadınların, yaşlıların, öğrencilerin ve dezavantajlı grupların yaşam şartlarını iyileştirmek; insan onurunu, hak ve hürriyetleri koruyan kalıcı çözümler geliştirmek.",
      visionLabel: "Vizyonumuz",
      visionText:
        "Sürdürülebilir ve insanı güçlendiren projeleriyle güven duyulan; kıtalar arası temsil ve iş birliği ağları güçlü; insani yardım, eğitim ve kalkınma alanlarında örnek gösterilen uluslararası bir sivil toplum kuruluşu olmak.",
      valuesLabel: "Temel Değerlerimiz",
      values: [
        "İnsan onuruna saygı",
        "Adalet ve hakkaniyet",
        "Merhamet ve dayanışma",
        "Şeffaflık ve güvenilirlik",
        "Sürdürülebilirlik",
        "Kurumlarla iş birliği",
        "Gönüllülük ve katılım",
      ],
    },
    programs: {
      title: {
        pre: "Yedi alan, tek amaç: ",
        highlight: "insan onuru.",
        post: "",
      },
      filterLabel: "İlgilendiğim alan",
      filters: [
        { key: "all", label: "Tüm çalışmalarımız" },
        { key: "relief", label: "Yardım ve destek" },
        { key: "education", label: "Eğitim" },
        { key: "development", label: "Kalkınma" },
        { key: "community", label: "Toplum" },
      ],
      cards: [
        {
          title: "İnsani Yardım",
          blurb: "Gıda, barınma, sağlık, temel ihtiyaç, ayni ve nakdî destek.",
          categoryKey: "relief",
        },
        {
          title: "Eğitim",
          blurb: "Burslar, öğrenci destek programları, eğitim merkezleri, rehberlik.",
          categoryKey: "education",
        },
        {
          title: "Sürdürülebilir Kalkınma",
          blurb: "Üretim kapasitesini ve ekonomik bağımsızlığı güçlendiren uzun vadeli projeler.",
          categoryKey: "development",
        },
        {
          title: "Çocuk, Gençlik ve Kadın",
          blurb: "Koruyucu ve geliştirici eğitim, sosyal destek ve beceri programları.",
          categoryKey: "community",
        },
        {
          title: "Sağlık ve Sosyal Destek",
          blurb: "İhtiyaç sahibi, afetzede, göçmen, yaşlı, engelli ve yetimlere destek.",
          categoryKey: "relief",
        },
        {
          title: "Kültür, Sanat ve Gönüllülük",
          blurb: "Toplumsal dayanışmayı ve gönüllü katılımını güçlendiren çalışmalar.",
          categoryKey: "community",
        },
        {
          title: "Kurumsal İş Birlikleri",
          blurb: "Farklı ülkelerdeki kurum ve üniversitelerle ortak projeler.",
          categoryKey: "development",
        },
      ],
      signposts: [
        {
          title: "Sahadan dahası",
          copy: "Programlarımızın yürüdüğü bölgelerden raporlar ve güncellemeler.",
          cta: "Saha notlarını okuyun",
        },
        {
          title: "IHBA'da neler oluyor",
          copy: "Gönüllü çağrıları, dönemsel kampanyalar, paydaş etkinlikleri ve öğrenci alımları.",
          cta: "Takvime bakın",
        },
      ],
      viewAll: "Tüm faaliyet alanları",
    },
    projects: {
      title: "Üç köprü inşa ediyoruz.",
      lede:
        "IHBA'da yıl boyunca çok şey oluyor. Şu anda inşa ettiklerimizden bazıları burada.",
      browseAll: "Tüm projelere bakın",
      cards: [
        {
          badgeKey: "planning",
          badge: "Hazırlık aşaması",
          region: "Afganistan",
          title: "Mezar-ı Şerif Eğitim Merkezi",
          summary:
            "7-18 yaş arası kız ve erkek öğrenciler için nitelikli eğitim yerleşkesi. Arsa satın alındı, resmî hazırlıklar sürüyor.",
          chips: ["~1.000 öğrenci", "Hedef 2027"],
        },
        {
          badgeKey: "active",
          badge: "Aktif",
          region: "Pakistan",
          title: "Pakistan Öğrenci Destek Programı",
          summary:
            "Türkiye'den Pakistan'a yükseköğrenim için giden öğrencilere üniversite seçimi, başvuru, burs ve barınma rehberliği.",
          chips: ["Burs", "Barınma", "Rehberlik"],
        },
        {
          badgeKey: "seasonal",
          badge: "Dönemsel",
          region: "Asya ve Afrika",
          title: "Ramazan ve Kurban Programları",
          summary:
            "Pakistan, Afganistan, Filistin ve Afrika'da iftar, gıda desteği ve kurban organizasyonları.",
          chips: ["İftar", "Gıda", "Kurban"],
        },
      ],
    },
    approach: {
      title: "Nasıl çalışıyoruz?",
      steps: [
        {
          title: "Acil yardım, kalıcı kalkınma",
          text: "Acil insani yardımı uzun vadeli eğitim ve kalkınma programlarıyla birleştiriyoruz.",
        },
        {
          title: "Yerel gerçekliklere göre",
          text: "Her proje bölgenin gerçek ihtiyaç ve şartlarına göre planlanır.",
        },
        {
          title: "Güvenilir saha ortakları",
          text: "Topluluklarını tanıyan yerel ortaklarla ulaştırıyoruz.",
        },
        {
          title: "Sınırlar ötesi iş birliği",
          text: "Temsilcilikler ve kurumsal iş birlikleri çalışmaları sürdürülebilir kılar.",
        },
      ],
    },
    presidentQuote: {
      quote:
        "Biliyoruz ki gerçek yardım, yalnızca bugün el uzatmak değil; yarının daha güçlü kurulmasına katkı sunmaktır.",
      name: "Abdullah Serenli",
      role: "Yönetim Kurulu Başkanı",
    },
    volunteer: {
      title: {
        pre: "",
        highlight: "Köprü olun.",
        post: "",
      },
      copy: "Zamanınızı, yeteneklerinizi veya bağışınızı verin — ne sunarsanız sunun, karşı kıyıya ulaştıralım.",
      ctaPrimary: "Bağış Yapın",
      ctaSecondary: "Gönüllü Olun",
      note: "Bağış hesapları yakında yayınlanacaktır — bugün katkı sağlamak için bize ulaşın.",
    },
newsletter: {
      socialTitle:
        "Bizden daha fazlasını görmek ve okumak ister misiniz? Sosyal medya hesaplarımızda saha güncellemeleri, öğrenci hikâyeleri ve IHBA'daki günlük hayat var.",
      title: "Aylık proje ve çağrı derlememizle ilgileniyor musunuz? Bültenimize kaydolun.",
      copy: "Yeni projeler ve saha haberleri, e-postanızda.",
      placeholder: "E-posta",
      subscribeLabel: "Abone ol",
      success: "Teşekkürler — listeye eklendiniz.",
    },
    latestNews: {
      title: "Son haberler",
      viewAll: "Tüm haberler",
    },
    campaign: {
      kicker: "Güncel çağrı",
      title: {
        pre: "Bir okul kur. ",
        highlight: "Bir gelecek inşa et.",
        post: "",
      },
      copy:
        "Mezar-ı Şerif Eğitim Merkezi, yaklaşık 1.000 kız ve erkek öğrenciye güvenle öğrenebileceği, yiyebileceği ve büyüyebileceği bir yer kazandıracak. Arsa satın alındı; sıra inşaatta. Desteğiniz yerleşkeyi bir adım daha yakına getirir.",
      ctaPrimary: "Bu projeye bağış yapın",
      ctaPrimaryHref: "/donate",
      ctaSecondary: "Projeyi okuyun",
      ctaSecondaryHref: "/projects/mazar-i-sharif-education-centre",
      goalLabel: "Hedef tamamlanma",
      goalValue: "2027 sonu",
      imageKey: "campaignImage",
    },
    contactSection: {
      title: "Bize ulaşın",
      lede:
        "Bağış, ortaklık, gönüllülük veya medya hakkında sorularınız mı var? Genellikle birkaç iş günü içinde yanıt veririz.",
      cta: "İletişime geçin",
    },
    footer: {
      addressLine:
        "Mecidiye Mah. Süngü Sk. Tevhit Çarşısı No: 2/212, Sultanbeyli / İstanbul",
      columns: [
        {
          header: "Hakkımızda",
          links: ["Biz kimiz", "Başkanın Mesajı", "Yönetim Kurulu", "Faaliyet Raporları"],
        },
        {
          header: "Faaliyet Alanları",
          links: ["İnsani Yardım", "Eğitim", "Sürdürülebilir Kalkınma", "Sağlık ve Sosyal Destek"],
        },
        {
          header: "Projeler",
          links: [
            "Mezar-ı Şerif Eğitim Merkezi",
            "Pakistan Öğrenci Programı",
            "Ramazan ve Kurban Programları",
          ],
        },
      ],
      contactLabel: "Genel sorularınız için bize ulaşın",
      reportTitle: "Bir sorunu bildirmek ister misiniz?",
      reportCopy:
        "Her bağış ve proje denetlenebilir. Bize yazın, beş iş günü içinde yanıt veririz.",
      copyright: "© 2026 IHBA — Uluslararası İnsanlık Köprüsü Derneği. Tüm hakları saklıdır.",
      transparency: "Kütük No: 34-291-110 · Vergi No: 8900485331 · MERSİS: 0890048533100001",
    },
  },
};
