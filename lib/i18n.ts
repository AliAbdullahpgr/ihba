export type Lang = "en" | "tr";

/** Stable, language-independent keys used for filtering the focus mosaic. */
export type CategoryKey = "relief" | "education" | "development" | "community";

export interface ProgramCard {
  title: string;
  blurb: string;
  categoryKey: CategoryKey;
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
      email: "aserenli@hotmail.com",
      phone: "+90 533 620 63 74",
    },
    social: {
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "X",
      linkedin: "LinkedIn",
      youtube: "YouTube",
    },
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
      title: "Who we are?",
      lede:
        "An international civil society organisation founded in Istanbul, working where urgent need and long-term opportunity meet.",
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
      email: "aserenli@hotmail.com",
      phone: "+90 533 620 63 74",
    },
    social: {
      facebook: "Facebook",
      instagram: "Instagram",
      twitter: "X",
      linkedin: "LinkedIn",
      youtube: "YouTube",
    },
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
      title: "Biz kimiz?",
      lede:
        "İstanbul'da kurulan, acil ihtiyaç ile uzun vadeli fırsatın kesiştiği yerde çalışan uluslararası bir sivil toplum kuruluşu.",
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
