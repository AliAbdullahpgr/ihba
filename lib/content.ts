import type { Lang } from "@/lib/i18n";

/**
 * Deeper page content, transcribed from the institutional content drafts
 * (IHBA_Website_Content_Draft_EN.docx / IHBA_Web_Sitesi_Icerik_Taslagi_TR.docx).
 * Kept separate from lib/i18n.ts, which holds homepage copy; the provider merges
 * both into a single `t`.
 */

export interface Row {
  label: string;
  value: string;
}

export type SocialKey =
  | "twitter"
  | "facebook"
  | "linkedin"
  | "instagram"
  | "youtube";

/**
 * Social profiles, in display order. The content drafts specify no accounts, so
 * this is empty and the social blocks collapse rather than rendering dead links.
 * Add a `url` per platform to bring the row back.
 */
export const socialLinks: { key: SocialKey; url: string }[] = [];

export interface Member {
  name: string;
  role: string;
}

export interface AreaDetail {
  title: string;
  blurb: string;
}

export interface ProjectDetail {
  slug: string;
  title: string;
  region: string;
  status: string;
  body: string[];
  facts: Row[];
  chips?: string[];
  image?: {
    src: string;
    alt: string;
    publicId?: string;
  };
}

export interface NewsItem {
  slug: string;
  title: string;
  excerpt: string;
  body: string[];
  publishedAt: string;
  image?: {
    src: string;
    alt: string;
    publicId?: string;
  };
}

export interface PageIntro {
  title: string;
  lede: string;
}

export interface Content {
  /** The single source of truth for navigation labels across header and footer. */
  nav: {
    home: string;
    about: string;
    board: string;
    president: string;
    areas: string;
    projects: string;
    news: string;
    donate: string;
    volunteer: string;
    contact: string;
    openMenu: string;
    closeMenu: string;
  };
  common: {
    backToProjects: string;
    allProjects: string;
    readProject: string;
    skipToContent: string;
    share: string;
    copyLink: string;
    copied: string;
    enlarge: string;
    close: string;
    previous: string;
    next: string;
  };
  /** Shared across both forms: labels, validation wording and outcomes. */
  forms: {
    fullName: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
    city: string;
    areaOfInterest: string;
    availability: string;
    availabilityHint: string;
    motivation: string;
    consent: string;
    optional: string;
    selectPrompt: string;
    noPreference: string;
    send: string;
    apply: string;
    privacy: string;
    consentLine: string;
    consentGiven: string;
    sentTitle: string;
    sentBody: string;
    volunteerSentBody: string;
    volunteerSubject: string;
    mailHint: string;
    mailOpenAgain: string;
    errors: {
      short: string;
      long: string;
      email: string;
      invalid: string;
      consent: string;
    };
  };
  identity: PageIntro & { rows: Row[] };
  aboutPage: PageIntro & {
    intro: string[];
    approachLabel: string;
    approachText: string;
    serveLabel: string;
    serveText: string;
    geographyLabel: string;
    geographyText: string;
  };
  boardPage: PageIntro & { members: Member[]; nameHeader: string; roleHeader: string };
  presidentPage: PageIntro & {
    name: string;
    role: string;
    message: string[];
  };
  areasPage: PageIntro & { items: AreaDetail[] };
  projectsPage: PageIntro & { details: ProjectDetail[]; moreTitle: string };
  newsPage: PageIntro & { empty: string; emptyCta: string; items?: NewsItem[] };
  donatePage: PageIntro & {
    body: string[];
    accountsNote: string;
    usesLabel: string;
    uses: string[];
  };
  volunteerPage: PageIntro & {
    body: string[];
    areasLabel: string;
    areas: string[];
    formNote: string;
    formTitle: string;
    photoCaption: string;
  };
  contactPage: PageIntro & {
    rows: Row[];
    addressLabel: string;
    address: string;
    formTitle: string;
  };
}

export const content: Record<Lang, Content> = {
  en: {
    nav: {
      home: "Home",
      about: "About Us",
      board: "Board of Directors",
      president: "Message from the President",
      areas: "Our Areas of Work",
      projects: "Projects",
      news: "News",
      donate: "Donate",
      volunteer: "Volunteer",
      contact: "Contact",
      openMenu: "Open menu",
      closeMenu: "Close menu",
    },
    common: {
      backToProjects: "All projects",
      allProjects: "See all projects",
      readProject: "Read the project",
      skipToContent: "Skip to content",
      share: "Share",
      copyLink: "Copy link",
      copied: "Copied",
      enlarge: "View larger",
      close: "Close",
      previous: "Previous image",
      next: "Next image",
    },
    forms: {
      fullName: "Full name",
      email: "Email address",
      phone: "Telephone",
      subject: "Subject",
      message: "Message",
      city: "City",
      areaOfInterest: "Area of interest",
      availability: "Availability",
      availabilityHint: "For example: weekday evenings, two days a month",
      motivation: "Why would you like to volunteer with us?",
      consent:
        "I agree that the association may keep the information above in order to respond to my application.",
      optional: "(optional)",
      selectPrompt: "Please choose",
      noPreference: "No preference — happy to help anywhere",
      send: "Send message",
      apply: "Send application",
      privacy:
        "Your information is stored securely so our team can respond. We do not sell or share it for marketing.",
      consentLine: "Consent",
      consentGiven: "Given",
      sentTitle: "Your message has been sent.",
      sentBody:
        "Thank you for contacting IHBA. Our team has received your message and usually replies within a few working days.",
      volunteerSentBody:
        "Thank you for applying. Our team has received your application and will be in touch about where your time can help most.",
      volunteerSubject: "Volunteer application",
      mailHint: "Nothing opened?",
      mailOpenAgain: "Open the email again",
      errors: {
        short: "Please write a little more here.",
        long: "This is longer than the field allows.",
        email: "Please check the email address.",
        invalid: "Please check this field.",
        consent: "Please confirm this to send your application.",
      },
    },
    identity: {
      title: "Institutional identity",
      lede: "Registered in Istanbul and operating as an association under Turkish law.",
      rows: [
        { label: "Official Turkish name", value: "Uluslararası İnsanlık Köprüsü Derneği" },
        { label: "English name", value: "International Humanity Bridge" },
        { label: "Short name / brand", value: "IHBA" },
        { label: "Legal form", value: "Association" },
        { label: "Date of establishment", value: "19 February 2025" },
        { label: "Head office", value: "Istanbul, Türkiye" },
        { label: "Registry number", value: "34-291-110" },
        { label: "Tax number", value: "8900485331" },
        { label: "MERSIS number", value: "0890048533100001" },
        { label: "Institutional status", value: "Active" },
        { label: "Field of activity", value: "Humanitarian Aid Associations" },
        { label: "Subcategory", value: "Assistance to People in Need" },
      ],
    },
    aboutPage: {
      title: "Who we are",
      lede:
        "A civil society organisation that places human dignity at the centre of its work — responding to urgent needs while building long-term development and community resilience.",
      intro: [
        "International Humanity Bridge (IHBA) is a civil society organisation that places human dignity at the centre of its work, responding to urgent needs while also promoting long-term development and community resilience. Established in Istanbul on 19 February 2025, IHBA works in education, humanitarian assistance, social support, sustainable development, youth, women, children, health, culture and the arts.",
        "IHBA believes that humanitarian action should not be limited to meeting temporary needs. It therefore prioritises projects that help people strengthen their own capacities, gain knowledge and skills, participate in productive life and build more independent futures.",
        "With a focus on Asia and Africa, IHBA aims to develop representative networks, local partnerships and strong institutional relations across different regions. Through these connections, it seeks to mobilise knowledge, experience and resources more effectively wherever they are needed. Its work is grounded in shared humanity, a sense of moral responsibility and openness to international cooperation.",
      ],
      approachLabel: "Our approach",
      approachText:
        "IHBA combines humanitarian assistance for urgent needs with long-term education and development programmes. It designs its projects around local realities, works with trusted partners on the ground, and regards country representation and institutional cooperation as essential to effectiveness and sustainability.",
      serveLabel: "Who we serve",
      serveText:
        "Children, young people, women, families, students, orphans, older persons, persons with disabilities, disaster-affected communities, people affected by displacement or conflict, and individuals and communities requiring economic or social support.",
      geographyLabel: "Where we work",
      geographyText:
        "IHBA works across regions where humanitarian needs and reliable local partnerships are present, with a particular focus on Asia and Africa. Activities are designed around local conditions and needs, bringing together humanitarian assistance, education, social support and sustainable development.",
    },
    boardPage: {
      title: "Board of Directors",
      lede: "The board elected at the association's founding, serving as its governing body.",
      nameHeader: "Name",
      roleHeader: "Position",
      members: [
        { name: "Abdullah Serenli", role: "Chairman of the Board" },
        { name: "İsmail Bakırhan", role: "Vice Chairman of the Board" },
        { name: "Durali Erdoğan", role: "Secretary General" },
        { name: "İdris Akarçeşme", role: "Treasurer" },
        { name: "Vedat Akkoyun", role: "Board Member" },
      ],
    },
    presidentPage: {
      title: "Message from the President",
      lede: "Humanity is a shared responsibility that reaches beyond borders and cultural differences.",
      name: "Abdullah Serenli",
      role: "Chairman of the Board",
      message: [
        "Humanity is a shared responsibility that reaches beyond borders and cultural differences. Wars, disasters, poverty, displacement and unequal access to education across the world require more than short-term relief. They call for lasting solutions that protect people and prepare them for the future.",
        "We established International Humanity Bridge to bring humanitarian assistance together with education, sustainable development and strong institutional cooperation. Our purpose is not merely to meet an immediate need, but to create opportunities through which people can rebuild their own lives, strengthen solidarity between societies and develop bridges of trust between institutions.",
        "In the regions where we work and seek to expand, particularly across Asia and Africa, we uphold respect for human dignity, transparency, sustainability and responsiveness to local realities. Guided by our moral values, we aim to serve people without discrimination based on faith, language, ethnicity or geography, and to transform compassion into lasting benefit.",
        "We believe that genuine assistance means not only extending a hand today, but also helping to build a stronger tomorrow. Together with our volunteers, donors, partners and cooperating institutions, we will continue to build new bridges for humanity.",
      ],
    },
    areasPage: {
      title: "Our areas of work",
      lede: "Seven fields, held together by one purpose: protecting and strengthening human dignity.",
      items: [
        {
          title: "Humanitarian Assistance",
          blurb: "Food, shelter, health, essential needs, and in-kind or financial support.",
        },
        {
          title: "Education",
          blurb:
            "Scholarships, student support programmes, education centres, guidance and awareness activities.",
        },
        {
          title: "Sustainable Development",
          blurb:
            "Long-term programmes that strengthen productive capacity and economic independence.",
        },
        {
          title: "Children, Youth and Women",
          blurb:
            "Protective, developmental and participatory education, social support and skills programmes.",
        },
        {
          title: "Health and Social Support",
          blurb:
            "Assistance for people in need, disaster-affected communities, displaced persons, older people, persons with disabilities, orphans and those requiring care.",
        },
        {
          title: "Culture, Arts and Volunteering",
          blurb:
            "Activities that strengthen social solidarity, intercultural communication and volunteer participation.",
        },
        {
          title: "Institutional Cooperation",
          blurb:
            "Joint initiatives with institutions, representative offices, universities and local partners in different countries.",
        },
      ],
    },
    projectsPage: {
      title: "Our projects and ongoing programmes",
      lede:
        "Three bridges under construction — one campus, one student pathway, and one seasonal programme that runs every year.",
      moreTitle: "More of our work",
      details: [
        {
          slug: "mazar-i-sharif-education-centre",
          title: "Mazar-i-Sharif Education Centre Project",
          region: "Afghanistan",
          status: "Planning and development stage",
          body: [
            "The Mazar-i-Sharif Education Centre Project has been developed to expand access to quality education for girls and boys aged 7 to 18 in Mazar-i-Sharif, Afghanistan. Designed for approximately 1,000 students, the centre will offer religious and ethical education alongside science and core academic subjects.",
            "The centre is intended to be more than a place of classroom instruction. It will be a comprehensive educational campus where children can learn and develop in a safe, supportive environment. Planned facilities include classrooms, student accommodation, a mosque, a dining hall, play areas and a park.",
            "The land for the centre has been purchased, and official and technical preparations are under way. Construction has not yet begun, and completion is targeted for the end of 2027.",
            "In the longer term, the campus is expected to serve as a base for humanitarian assistance and sustainable development initiatives in the region, while also hosting education, skills development and social support programmes for women and girls.",
          ],
          facts: [
            { label: "Target group", value: "Girls and boys aged 7-18" },
            { label: "Planned capacity", value: "Approximately 1,000 students" },
            {
              label: "Current status",
              value: "Land purchased; official and technical preparations under way",
            },
            { label: "Target completion", value: "End of 2027" },
          ],
        },
        {
          slug: "pakistan-student-support",
          title: "Pakistan International Student Education and Support Programme",
          region: "Pakistan",
          status: "Active and developing",
          body: [
            "This programme aims to make the educational journey of students travelling from Türkiye to Pakistan for higher education safer, better organised and more sustainable. Students receive guidance from university research and selection through application and enrolment, as well as support with accommodation and adjustment to the country and its education system.",
            "The programme includes communication with universities across Pakistan, guidance towards suitable academic departments, follow-up of registration procedures, development of scholarship and accommodation opportunities, and access to social support throughout students' academic lives.",
            "IHBA regards this initiative not merely as a student placement service, but as a long-term bridge strengthening educational, cultural and youth relations between Türkiye and Pakistan.",
          ],
          facts: [
            {
              label: "Target group",
              value: "Prospective and current university students in Pakistan",
            },
            {
              label: "Main support",
              value:
                "University selection, application, enrolment, scholarships, accommodation, orientation and guidance",
            },
            {
              label: "Programme type",
              value: "Ongoing education and student support programme",
            },
          ],
        },
        {
          slug: "ramadan-qurban-programmes",
          title: "Ramadan and Qurban Humanitarian Programmes",
          region: "Asia, Africa and other regions in need",
          status: "Seasonal and recurring",
          body: [
            "During Ramadan and Qurban, IHBA delivers humanitarian assistance to families and communities in need. Activities include iftar programmes, food and essential-needs support, and Qurban organisation, particularly in Pakistan, Afghanistan, Palestine and different regions of Africa where needs are identified.",
            "Programmes are planned in coordination with trusted local partners and adapted to local conditions. IHBA seeks to ensure that assistance reaches people directly, consistently and with respect for human dignity. Wherever possible, seasonal support is also used as a foundation for longer-term social and development initiatives.",
          ],
          facts: [
            {
              label: "Activities",
              value:
                "Iftar programmes, food and essential-needs support, Qurban organisation and meat distribution",
            },
            { label: "Period", value: "Ramadan and Qurban seasons" },
            {
              label: "Delivery model",
              value: "Local needs assessment and coordination with field partners",
            },
          ],
        },
      ],
    },
    newsPage: {
      title: "News",
      lede: "Field reports, project updates and announcements from the regions where we work.",
      empty:
        "We are preparing our first field reports. Until they are published, our current work is documented on the project pages.",
      emptyCta: "See our projects",
    },
    donatePage: {
      title: "Donate",
      lede:
        "Your support funds humanitarian assistance, education, scholarships and sustainable development programmes.",
      body: [
        "IHBA accepts donations to support its humanitarian assistance, education, scholarship and sustainable development programmes.",
        "Official bank accounts and donation methods will be added to the website once the relevant institutional information is provided. In the meantime, please contact us directly and we will arrange your contribution.",
      ],
      accountsNote:
        "Official bank accounts and donation methods will be published here shortly.",
      usesLabel: "What your donation supports",
      uses: [
        "Humanitarian assistance — food, shelter, health and essential needs",
        "Scholarships and student support programmes",
        "The Mazar-i-Sharif Education Centre",
        "Ramadan and Qurban seasonal programmes",
        "Sustainable development and skills programmes",
      ],
    },
    volunteerPage: {
      title: "Volunteer",
      lede: "Give your time and skills — whatever you bring, we will make sure it reaches the other side.",
      body: [
        "IHBA welcomes volunteers. Depending on their skills and availability, volunteers may contribute to field activities, student and education programmes, events, communications, content production, project development and seasonal humanitarian programmes.",
      ],
      areasLabel: "Where volunteers contribute",
      areas: [
        "Field activities",
        "Student and education programmes",
        "Events and organisation",
        "Communications",
        "Content production",
        "Project development",
        "Seasonal humanitarian programmes",
      ],
      formNote:
        "Tell us where your time and skills fit best. There is no minimum commitment — a few hours a month is a real contribution.",
      formTitle: "Volunteer application",
      photoCaption:
        "Volunteers preparing school and essential-supply kits for distribution.",
    },
    contactPage: {
      title: "Contact",
      lede: "Get in touch about donations, volunteering, partnerships or media enquiries.",
      addressLabel: "Head office address",
      formTitle: "Write to us",
      address:
        "Mecidiye Neighbourhood, Süngü Street, Tevhit Çarşısı, Building No. 2, Unit No. 212, Sultanbeyli / Istanbul / Türkiye",
      rows: [
        { label: "Telephone", value: "+90 533 620 63 74" },
        { label: "Email", value: "aserenli@hotmail.com" },
        { label: "Head office", value: "Istanbul, Türkiye" },
        { label: "Registry number", value: "34-291-110" },
      ],
    },
  },

  tr: {
    nav: {
      home: "Ana Sayfa",
      about: "Hakkımızda",
      board: "Yönetim Kurulu",
      president: "Başkanın Mesajı",
      areas: "Faaliyet Alanlarımız",
      projects: "Projeler",
      news: "Haberler",
      donate: "Bağış",
      volunteer: "Gönüllülük",
      contact: "İletişim",
      openMenu: "Menüyü aç",
      closeMenu: "Menüyü kapat",
    },
    common: {
      backToProjects: "Tüm projeler",
      allProjects: "Tüm projelere bakın",
      readProject: "Projeyi okuyun",
      skipToContent: "İçeriğe geç",
      share: "Paylaş",
      copyLink: "Bağlantıyı kopyala",
      copied: "Kopyalandı",
      enlarge: "Büyük görüntüle",
      close: "Kapat",
      previous: "Önceki görsel",
      next: "Sonraki görsel",
    },
    forms: {
      fullName: "Ad soyad",
      email: "E-posta adresi",
      phone: "Telefon",
      subject: "Konu",
      message: "Mesajınız",
      city: "Şehir",
      areaOfInterest: "İlgi alanı",
      availability: "Uygun olduğunuz zamanlar",
      availabilityHint: "Örneğin: hafta içi akşamları, ayda iki gün",
      motivation: "Neden gönüllü olmak istiyorsunuz?",
      consent:
        "Başvuruma dönüş yapılabilmesi için yukarıdaki bilgilerin derneğimizde saklanmasını kabul ediyorum.",
      optional: "(isteğe bağlı)",
      selectPrompt: "Lütfen seçin",
      noPreference: "Fark etmez — her alanda yardımcı olabilirim",
      send: "Mesajı gönder",
      apply: "Başvuruyu gönder",
      privacy:
        "Bilgileriniz ekibimizin size dönüş yapabilmesi için güvenli şekilde saklanır; pazarlama amacıyla satılmaz veya paylaşılmaz.",
      consentLine: "Onay",
      consentGiven: "Verildi",
      sentTitle: "Mesajınız gönderildi.",
      sentBody:
        "IHBA ile iletişime geçtiğiniz için teşekkür ederiz. Ekibimiz mesajınızı aldı ve genellikle birkaç iş günü içinde yanıt verir.",
      volunteerSentBody:
        "Başvurunuz için teşekkür ederiz. Ekibimiz başvurunuzu aldı; zamanınızın en çok fayda sağlayacağı alanlar için sizinle iletişime geçeceğiz.",
      volunteerSubject: "Gönüllü başvurusu",
      mailHint: "Hiçbir şey açılmadı mı?",
      mailOpenAgain: "E-postayı yeniden açın",
      errors: {
        short: "Lütfen buraya biraz daha yazın.",
        long: "Bu alan için fazla uzun.",
        email: "Lütfen e-posta adresini kontrol edin.",
        invalid: "Lütfen bu alanı kontrol edin.",
        consent: "Başvurunuzu göndermek için lütfen bunu onaylayın.",
      },
    },
    identity: {
      title: "Kurumsal kimlik",
      lede: "İstanbul'da tescil edilmiş, Türk hukukuna tabi bir dernektir.",
      rows: [
        { label: "Resmî Türkçe adı", value: "Uluslararası İnsanlık Köprüsü Derneği" },
        { label: "İngilizce adı", value: "International Humanity Bridge" },
        { label: "Kısa adı / markası", value: "IHBA" },
        { label: "Kurum türü", value: "Dernek" },
        { label: "Kuruluş tarihi", value: "19 Şubat 2025" },
        { label: "Genel merkez", value: "İstanbul, Türkiye" },
        { label: "Kütük numarası", value: "34-291-110" },
        { label: "Vergi numarası", value: "8900485331" },
        { label: "MERSİS numarası", value: "0890048533100001" },
        { label: "Kurum durumu", value: "Faal" },
        { label: "Faaliyet alanı", value: "İnsani Yardım Dernekleri" },
        { label: "Alt nevi", value: "İhtiyaç Sahiplerine Yardım" },
      ],
    },
    aboutPage: {
      title: "Biz kimiz",
      lede:
        "İnsan onurunu merkeze alan, acil ihtiyaçlara cevap verirken uzun vadeli gelişimi ve toplumsal dayanıklılığı da gözeten bir sivil toplum kuruluşu.",
      intro: [
        "Uluslararası İnsanlık Köprüsü Derneği (IHBA), insan onurunu merkeze alan, acil ihtiyaçlara cevap verirken uzun vadeli gelişimi ve toplumsal dayanıklılığı da gözeten bir sivil toplum kuruluşudur. 19 Şubat 2025 tarihinde İstanbul'da kurulan IHBA; eğitim, insani yardım, sosyal destek, sürdürülebilir kalkınma, gençlik, kadın, çocuk, sağlık, kültür ve sanat alanlarında faaliyet göstermektedir.",
        "IHBA, insani yardım çalışmalarının yalnızca geçici ihtiyaçların karşılanmasıyla sınırlı kalmaması gerektiğine inanır. Bu nedenle ihtiyaç sahibi bireylerin kendi imkânlarını geliştirmesine, bilgi ve beceri kazanmasına, üretime katılmasına ve daha bağımsız bir yaşam kurmasına katkı sağlayan projelere öncelik verir.",
        "Başta Asya ve Afrika olmak üzere farklı coğrafyalarda temsilcilikler, yerel ortaklıklar ve güçlü kurumsal ilişkiler geliştirmeyi hedefleyen dernek; bilgi, tecrübe ve kaynakların ihtiyaç duyulan bölgelere daha etkili biçimde ulaşmasını amaçlar. Çalışmalarını insanlık ortak paydasında, manevi sorumluluk bilinciyle ve uluslararası iş birliğine açık bir anlayışla yürütür.",
      ],
      approachLabel: "Çalışma yaklaşımımız",
      approachText:
        "IHBA, acil ihtiyaçlara cevap veren insani yardım çalışmalarını uzun vadeli eğitim ve kalkınma projeleriyle birlikte ele alır. Projelerini yerel ihtiyaçlara göre planlar, güvenilir saha ortaklarıyla uygular ve farklı ülkelerdeki temsilcilikler ile kurumsal iş birliklerini etkinliğin ve sürdürülebilirliğin önemli bir parçası olarak görür.",
      serveLabel: "Hedef kitlemiz",
      serveText:
        "Çocuklar, gençler, kadınlar, aileler, öğrenciler, yetimler, yaşlılar, engelliler, afetzedeler, göç veya çatışma nedeniyle mağdur olmuş kişiler ile ekonomik ve sosyal açıdan desteğe ihtiyaç duyan bireyler ve topluluklar.",
      geographyLabel: "Faaliyet coğrafyamız",
      geographyText:
        "IHBA, başta Asya ve Afrika olmak üzere ihtiyaçların ve yerel iş birliklerinin bulunduğu farklı coğrafyalarda faaliyet yürütür. Çalışmalar, bölgenin şartları ve ihtiyaçları dikkate alınarak insani yardım, eğitim, sosyal destek ve sürdürülebilir kalkınma ekseninde planlanır.",
    },
    boardPage: {
      title: "Yönetim Kurulu",
      lede: "Derneğin kuruluşunda seçilen ve karar organı olarak görev yapan yönetim kurulu.",
      nameHeader: "Adı Soyadı",
      roleHeader: "Görevi",
      members: [
        { name: "Abdullah Serenli", role: "Yönetim Kurulu Başkanı" },
        { name: "İsmail Bakırhan", role: "Yönetim Kurulu Başkan Yardımcısı" },
        { name: "Durali Erdoğan", role: "Genel Sekreter" },
        { name: "İdris Akarçeşme", role: "Muhasip Üye" },
        { name: "Vedat Akkoyun", role: "Üye" },
      ],
    },
    presidentPage: {
      title: "Başkanın Mesajı",
      lede:
        "İnsanlık, coğrafi sınırların ve kültürel farklılıkların ötesinde hepimizin ortak sorumluluğudur.",
      name: "Abdullah Serenli",
      role: "Yönetim Kurulu Başkanı",
      message: [
        "İnsanlık, coğrafi sınırların ve kültürel farklılıkların ötesinde hepimizin ortak sorumluluğudur. Dünyanın farklı bölgelerinde yaşanan savaşlar, afetler, yoksulluk, göç ve eğitim eşitsizliği; yalnızca kısa süreli yardımları değil, insanı koruyan ve geleceğe hazırlayan kalıcı çözümleri gerekli kılmaktadır.",
        "Uluslararası İnsanlık Köprüsü Derneği'ni, insani yardım çalışmalarını eğitim, sürdürülebilir kalkınma ve güçlü kurumsal iş birlikleriyle buluşturan bir anlayışla kurduk. Amacımız yalnızca bir ihtiyacı geçici olarak karşılamak değil; insanların kendi hayatlarını yeniden inşa edebilecekleri imkânları oluşturmak, toplumlar arasında dayanışmayı güçlendirmek ve kurumlar arasında güvene dayalı köprüler kurmaktır.",
        "Başta Asya ve Afrika olmak üzere ihtiyaç duyulan coğrafyalarda yürüttüğümüz ve geliştirmeyi hedeflediğimiz çalışmalarda insan onuruna saygıyı, şeffaflığı, sürdürülebilirliği ve yerel gerçekliklere uygun hareket etmeyi temel ilke kabul ediyoruz. Manevi değerlerimizden aldığımız sorumlulukla, din, dil, ırk veya coğrafya ayrımı gözetmeden insana ulaşmayı ve iyiliği kalıcı bir değere dönüştürmeyi amaçlıyoruz.",
        "Biliyoruz ki gerçek yardım, yalnızca bugün el uzatmak değil; yarının daha güçlü kurulmasına katkı sunmaktır. Bu yolda gönüllülerimiz, bağışçılarımız, paydaşlarımız ve iş birliği yaptığımız kurumlarla birlikte insanlık için yeni köprüler kurmaya devam edeceğiz.",
      ],
    },
    areasPage: {
      title: "Faaliyet alanlarımız",
      lede: "Yedi alan, tek amaç: insan onurunu korumak ve güçlendirmek.",
      items: [
        {
          title: "İnsani Yardım",
          blurb: "Gıda, barınma, sağlık, temel ihtiyaç, ayni ve nakdî destek çalışmaları.",
        },
        {
          title: "Eğitim",
          blurb:
            "Burs, öğrenci destek programları, eğitim merkezleri, rehberlik ve farkındalık faaliyetleri.",
        },
        {
          title: "Sürdürülebilir Kalkınma",
          blurb:
            "Bireylerin üretim kapasitesini ve ekonomik bağımsızlığını güçlendiren uzun vadeli projeler.",
        },
        {
          title: "Çocuk, Gençlik ve Kadın Çalışmaları",
          blurb:
            "Koruyucu, geliştirici ve katılımı artıran eğitim, sosyal destek ve beceri programları.",
        },
        {
          title: "Sağlık ve Sosyal Destek",
          blurb:
            "İhtiyaç sahibi, afetzede, göçmen, yaşlı, engelli, yetim ve bakıma muhtaç bireylere yönelik destekler.",
        },
        {
          title: "Kültür, Sanat ve Gönüllülük",
          blurb:
            "Toplumsal dayanışmayı, kültürler arası iletişimi ve gönüllü katılımını güçlendiren çalışmalar.",
        },
        {
          title: "Kurumsal İş Birlikleri",
          blurb:
            "Farklı ülkelerdeki kurumlar, temsilcilikler, üniversiteler ve yerel paydaşlarla ortak projeler.",
        },
      ],
    },
    projectsPage: {
      title: "Projelerimiz ve süreklilik gösteren çalışmalarımız",
      lede:
        "İnşa hâlinde üç köprü — bir eğitim yerleşkesi, bir öğrenci yolculuğu ve her yıl tekrarlanan bir dönemsel program.",
      moreTitle: "Çalışmalarımızdan diğerleri",
      details: [
        {
          slug: "mazar-i-sharif-education-centre",
          title: "Mezar-ı Şerif Eğitim Merkezi Projesi",
          region: "Afganistan",
          status: "Hazırlık ve geliştirme aşaması",
          body: [
            "Mezar-ı Şerif Eğitim Merkezi Projesi, Afganistan'ın Mezar-ı Şerif bölgesinde yaşayan 7-18 yaş aralığındaki kız ve erkek öğrencilerin nitelikli eğitime erişimini desteklemek amacıyla geliştirilmiştir. Yaklaşık 1.000 öğrenci kapasitesine sahip olması planlanan merkezde dinî ve ahlaki eğitimin yanı sıra fen bilimleri ve temel akademik alanlarda eğitimler verilecektir.",
            "Merkezin yalnızca ders verilen bir yapı değil, çocukların güvenli ve destekleyici bir ortamda gelişebileceği bütüncül bir eğitim yerleşkesi olması hedeflenmektedir. Proje kapsamında derslikler, öğrenci yurdu, mescit, yemekhane, oyun alanları ve park gibi bölümler planlanmaktadır.",
            "Eğitim merkezinin kurulacağı arsa satın alınmış, resmî ve teknik hazırlık süreçlerine başlanmıştır. İnşaat henüz başlamamış olup merkezin 2027 yılının sonuna kadar tamamlanması hedeflenmektedir.",
            "Yerleşkenin ilerleyen dönemlerde bölgedeki insani yardım ve sürdürülebilir kalkınma çalışmalarının yürütülebileceği bir merkez hâline gelmesi; ayrıca kadınlar ve kız çocuklarına yönelik eğitim, beceri geliştirme ve sosyal destek faaliyetlerine ev sahipliği yapması planlanmaktadır.",
          ],
          facts: [
            { label: "Hedef kitle", value: "7-18 yaş aralığındaki kız ve erkek öğrenciler" },
            { label: "Planlanan kapasite", value: "Yaklaşık 1.000 öğrenci" },
            {
              label: "Mevcut durum",
              value: "Arsa satın alındı; proje, resmî ve teknik hazırlık aşamasında",
            },
            { label: "Hedef tamamlanma", value: "2027 yılı sonu" },
          ],
        },
        {
          slug: "pakistan-student-support",
          title: "Pakistan Uluslararası Öğrenci Eğitim ve Destek Programı",
          region: "Pakistan",
          status: "Uygulanmakta ve geliştirilmektedir",
          body: [
            "Bu program, Türkiye'den Pakistan'a yükseköğrenim amacıyla giden öğrencilerin eğitim yolculuğunu daha güvenli, planlı ve sürdürülebilir hâle getirmeyi amaçlar. Öğrencilere üniversite araştırması ve tercih sürecinden başvuru ve kayıt işlemlerine, barınma imkânlarından ülkeye ve eğitim sistemine uyum sürecine kadar rehberlik sağlanır.",
            "Program kapsamında Pakistan'daki farklı üniversitelerle iletişim kurulması, öğrencilerin uygun bölümlere yönlendirilmesi, kayıt süreçlerinin takip edilmesi, burs ve barınma imkânlarının geliştirilmesi ve öğrencilerin eğitim hayatları boyunca ihtiyaç duydukları sosyal desteğe erişmelerine katkı sunulması hedeflenmektedir.",
            "IHBA, bu çalışmayı yalnızca öğrenci yerleştirme faaliyeti olarak değil; Türkiye ile Pakistan arasında eğitim, kültür ve gençlik bağlarını güçlendiren uzun vadeli bir köprü olarak ele alır.",
          ],
          facts: [
            {
              label: "Hedef kitle",
              value:
                "Pakistan'da üniversite eğitimi almak isteyen ve eğitimine devam eden öğrenciler",
            },
            {
              label: "Başlıca destekler",
              value: "Üniversite seçimi, başvuru, kayıt, burs, barınma, uyum ve rehberlik",
            },
            { label: "Proje niteliği", value: "Sürekli eğitim ve öğrenci destek programı" },
          ],
        },
        {
          slug: "ramadan-qurban-programmes",
          title: "Ramazan ve Kurban Dönemi İnsani Yardım Faaliyetleri",
          region: "Asya, Afrika ve ihtiyaç duyulan diğer coğrafyalar",
          status: "Dönemsel ve süreklilik gösteren çalışma",
          body: [
            "IHBA, Ramazan ve Kurban dönemlerinde ihtiyaç sahibi ailelere ve topluluklara yönelik insani yardım faaliyetleri yürütmektedir. Pakistan, Afganistan, Filistin ve Afrika'daki farklı bölgeler başta olmak üzere ihtiyaç tespit edilen coğrafyalarda iftar programları, gıda ve temel ihtiyaç destekleri ile kurban organizasyonları gerçekleştirilmektedir.",
            "Faaliyetler, yerel ihtiyaçlar ve saha şartları dikkate alınarak güvenilir yerel paydaşlarla koordinasyon içinde planlanır. Yardımların insan onuruna uygun, düzenli ve doğrudan ihtiyaç sahiplerine ulaştırılması; mümkün olan durumlarda dönemsel desteklerin daha uzun vadeli sosyal ve kalkınma çalışmalarına zemin hazırlaması amaçlanır.",
          ],
          facts: [
            {
              label: "Faaliyet türleri",
              value: "İftar, gıda ve temel ihtiyaç desteği, kurban organizasyonu ve et dağıtımı",
            },
            { label: "Uygulama dönemi", value: "Ramazan ve Kurban dönemleri" },
            { label: "Çalışma modeli", value: "Yerel ihtiyaç analizi ve saha ortaklarıyla koordinasyon" },
          ],
        },
      ],
    },
    newsPage: {
      title: "Haberler",
      lede: "Çalıştığımız bölgelerden saha raporları, proje güncellemeleri ve duyurular.",
      empty:
        "İlk saha raporlarımızı hazırlıyoruz. Yayınlanana kadar güncel çalışmalarımız proje sayfalarında yer alıyor.",
      emptyCta: "Projelerimize bakın",
    },
    donatePage: {
      title: "Bağış",
      lede:
        "Desteğiniz insani yardım, eğitim, burs ve sürdürülebilir kalkınma programlarını finanse eder.",
      body: [
        "IHBA, insani yardım, eğitim, burs ve sürdürülebilir kalkınma çalışmalarının desteklenmesi amacıyla bağış kabul etmektedir.",
        "Resmî banka hesapları ve bağış seçenekleri, kurum tarafından ayrıca sağlanacak bilgiler doğrultusunda web sitesine eklenecektir. Bu süreçte doğrudan bizimle iletişime geçebilirsiniz; katkınızı birlikte planlarız.",
      ],
      accountsNote:
        "Resmî banka hesapları ve bağış seçenekleri kısa süre içinde burada yayınlanacaktır.",
      usesLabel: "Bağışınız neyi destekler",
      uses: [
        "İnsani yardım — gıda, barınma, sağlık ve temel ihtiyaçlar",
        "Burs ve öğrenci destek programları",
        "Mezar-ı Şerif Eğitim Merkezi",
        "Ramazan ve Kurban dönemi programları",
        "Sürdürülebilir kalkınma ve beceri programları",
      ],
    },
    volunteerPage: {
      title: "Gönüllülük",
      lede:
        "Zamanınızı ve yeteneklerinizi verin — ne sunarsanız sunun, karşı kıyıya ulaştıralım.",
      body: [
        "Dernek, gönüllü katılımına açıktır. Gönüllüler; saha faaliyetleri, öğrenci ve eğitim çalışmaları, organizasyon, iletişim, içerik üretimi, proje geliştirme ve dönemsel yardım çalışmalarına beceri ve imkânları doğrultusunda katkı sunabilir.",
      ],
      areasLabel: "Gönüllülerin katkı sunduğu alanlar",
      areas: [
        "Saha faaliyetleri",
        "Öğrenci ve eğitim çalışmaları",
        "Organizasyon ve etkinlikler",
        "İletişim",
        "İçerik üretimi",
        "Proje geliştirme",
        "Dönemsel yardım çalışmaları",
      ],
      formNote:
        "Zamanınızın ve becerilerinizin en çok nerede karşılık bulacağını bize yazın. Asgari bir taahhüt yok — ayda birkaç saat de gerçek bir katkıdır.",
      formTitle: "Gönüllü başvurusu",
      photoCaption:
        "Dağıtım için okul ve temel ihtiyaç kolileri hazırlayan gönüllüler.",
    },
    contactPage: {
      title: "İletişim",
      lede: "Bağış, gönüllülük, iş birliği veya basın talepleriniz için bize ulaşın.",
      addressLabel: "Merkez adresi",
      formTitle: "Bize yazın",
      address:
        "Mecidiye Mahallesi, Süngü Sokak, Tevhit Çarşısı, Dış Kapı No: 2, İç Kapı No: 212, Sultanbeyli / İstanbul / Türkiye",
      rows: [
        { label: "Telefon numarası", value: "+90 533 620 63 74" },
        { label: "E-posta adresi", value: "aserenli@hotmail.com" },
        { label: "Genel merkez", value: "İstanbul, Türkiye" },
        { label: "Kütük numarası", value: "34-291-110" },
      ],
    },
  },
};
