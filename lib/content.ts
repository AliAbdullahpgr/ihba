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
  /** The substance of the field: how IHBA approaches it and what it prioritises. */
  body: string[];
  /** Short noun phrases naming the kinds of activity the field covers. */
  activities: string[];
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

export interface LegalPageContent extends PageIntro {
  updatedLabel: string;
  lastUpdated: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

/**
 * One switchable panel in the "principles and governance" band on the About
 * page. `key` is stable and language-independent so the open panel survives a
 * language switch; it is also hidden from the CMS field editor.
 */
export interface PrinciplePanel {
  key: string;
  label: string;
  heading: string;
  paragraphs: string[];
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
    gallery: string;
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
    principlesTitle: string;
    principlesLede: string;
    principlesNavLabel: string;
    panels: PrinciplePanel[];
  };
  boardPage: PageIntro & { members: Member[]; nameHeader: string; roleHeader: string };
  presidentPage: PageIntro & {
    name: string;
    role: string;
    imageAlt: string;
    photoEnabled: boolean;
    message: string[];
  };
  areasPage: PageIntro & {
    intro: string[];
    activitiesLabel: string;
    jumpLabel: string;
    items: AreaDetail[];
  };
  projectsPage: PageIntro & { details: ProjectDetail[]; moreTitle: string };
  newsPage: PageIntro & { empty: string; emptyCta: string; items?: NewsItem[] };
  galleryPage: PageIntro;
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
  legalPages: {
    kvkk: LegalPageContent;
    privacy: LegalPageContent;
    cookies: LegalPageContent;
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
      gallery: "Gallery",
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
      principlesTitle: "Our principles and how we are governed",
      principlesLede:
        "Humanitarian work is only as good as the standards behind it. These are the commitments that decide how we act in the field, how we handle the resources entrusted to us, and how our work is checked.",
      principlesNavLabel: "Choose a topic",
      panels: [
        {
          key: "ethics",
          label: "Ethical values",
          heading: "Ethical values",
          paragraphs: [
            "IHBA regards the protection of human life, belief, reason, property and family as a fundamental right, and organises its work accordingly. Everything we do begins from the dignity of the person in front of us: assistance is offered because someone needs it, never as a reward, an inducement or a condition attached to something else. Where dignity and need conflict with convenience, we choose dignity.",
            "We deliver humanitarian assistance on the basis of need alone. Nationality, race, gender, religious belief, social class and political opinion play no part in deciding who is helped and who is not. Within a community we assess need honestly and openly, and we accept that the most urgent case is not always the most visible one.",
            "We remain independent of political, economic and military objectives wherever we work. In places of conflict or tension IHBA takes no side and involves itself in no political, ethnic, sectarian or ideological dispute. Our presence in a region is explained by need and by nothing else, and we protect that independence because it is what makes access and trust possible.",
            "We work to be effective, not merely present. That means intervening in good time and in coordination with others, strengthening local capacity rather than displacing it, and thinking carefully about the unintended effects of aid — dependency, distorted local markets, or attention drawn to people who would rather not be seen. A project that would leave a community weaker than it found it is not a project we run.",
          ],
        },
        {
          key: "integrity",
          label: "Integrity and conduct",
          heading: "Integrity, conflicts of interest and confidentiality",
          paragraphs: [
            "No one acting for IHBA may accept discounts, gifts, hospitality or material advantages that could reasonably be expected to influence a decision, and no one may offer them. Any relationship — personal, commercial or institutional — that could place a colleague's judgement in question must be declared before a decision is taken rather than explained afterwards.",
            "We respect the professional obligations of everyone we work with: partners, suppliers, contractors, consultants and volunteers. We do not ask anyone to act against the standards of their own profession, and we do not overstate the qualifications, capacity or track record of the people and organisations working with us.",
            "Information reached through our work — about beneficiaries, staff, partners or donors — is held in confidence and is never used for personal advantage or passed to third parties for theirs. Personal data on the people we assist is treated as the most sensitive information we hold, because for many of them exposure carries a real risk.",
            "We are accountable for all of it. Complaints and criticism are welcome and are answered rather than absorbed: beneficiaries, donors, volunteers and partners can raise a concern and expect a considered reply. What we learn from a mistake is shared internally so that it changes practice, and not only in the team where it happened.",
          ],
        },
        {
          key: "compliance",
          label: "Compliance and risk",
          heading: "Compliance and risk management",
          paragraphs: [
            "IHBA builds its operating processes around Turkish law and recognised international humanitarian standards, so that every donation and every hour of volunteer time is used for the purpose it was given for and produces the benefit it was meant to produce. Compliance is treated as part of programme design, not as a form filled in once the work is finished.",
            "We maintain policies against money laundering, the financing of terrorism, bribery and corruption, and we apply them to partners, suppliers and transfer routes as well as to ourselves. Funds move through documented channels, partners are checked before an agreement is signed, and the movement of money and goods is traceable from donor to destination.",
            "Risk is assessed before a programme begins and monitored while it runs — financial, legal, operational, reputational and security risk, including the safety of the people delivering the work. Controls are tested rather than assumed, weaknesses are recorded with a named owner and a deadline, and internal rules are revised whenever a gap appears between how we say we work and how we actually work.",
          ],
        },
        {
          key: "oversight",
          label: "Audit and oversight",
          heading: "Audit and oversight",
          paragraphs: [
            "IHBA's accounts and activities are subject to the oversight the law provides for associations in Türkiye, including annual reporting to the competent public authorities and audit of its financial statements. Registry, tax and MERSIS details are published on this page so that anyone can verify who we are before deciding to support us.",
            "Alongside external oversight, the Board of Directors reviews the association's finances and programmes and reports to the general assembly. Expenditure is authorised against approved budgets, project spending is reconciled with the documents behind it, and financial and programme records are kept so that any single item of spending can be traced back to a decision.",
            "Field work is checked in the field. Projects are visited and reviewed against what was planned — what was delivered, to whom, at what cost, and what changed as a result — and partner organisations are assessed on the same basis. Where a review finds something wrong, the finding is written down, the correction is followed up, and the lesson is carried into the next project rather than left in a report.",
          ],
        },
      ],
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
      imageAlt: "Abdullah Serenli, Chairman of the Board of IHBA",
      photoEnabled: true,
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
      intro: [
        "IHBA works across seven fields, and they are deliberately connected. A family that needs food this month may need a school place for its children next year, and a way of earning a living after that. Treating those needs as separate programmes, handled by separate organisations, is what leaves people moving between forms of assistance without ever moving beyond them.",
        "Each field below therefore describes both what IHBA does and how it tries to work: what it looks at before starting, what it refuses to do, and what it hands on to the next stage. Where a region's needs and reliable local partnerships allow, several of these fields run alongside one another rather than in sequence.",
      ],
      activitiesLabel: "In practice",
      jumpLabel: "Jump to a field",
      items: [
        {
          title: "Humanitarian Assistance",
          blurb: "Food, shelter, health, essential needs, and in-kind or financial support.",
          body: [
            "Humanitarian assistance responds to urgent need: food, shelter, health care and the essentials that let people survive a crisis without losing their dignity. IHBA treats it as a foundation for recovery rather than a one-off handout — delivered through trusted local partners, on the basis of need alone, and paired with education or livelihood support wherever possible so that relief gives way to independence rather than dependency.",
          ],
          activities: [
            "Food distribution and emergency rations",
            "Temporary shelter and accommodation support",
            "Health care and medical assistance",
            "Essential household supplies and survival kits",
            "Cash assistance and in-kind support",
            "Winter and seasonal emergency aid",
          ],
        },
        {
          title: "Education",
          blurb:
            "Scholarships, student support programmes, education centres, guidance and awareness activities.",
          body: [
            "Education removes the barriers that keep people from building an independent future, from primary schooling to higher education. IHBA combines direct provision with mentorship, scholarships and skills training, partnering with schools, universities and community organisations — and often pairing it with livelihood or health support so that learning translates into real opportunity.",
          ],
          activities: [
            "Primary and secondary schooling programmes",
            "Scholarships and student financial support",
            "Higher education guidance and mentorship",
            "Learning centres and education facilities",
            "Skills development and vocational training",
            "Awareness and guidance for young people",
          ],
        },
        {
          title: "Sustainable Development",
          blurb:
            "Long-term programmes that strengthen productive capacity and economic independence.",
          body: [
            "Sustainable development goes beyond temporary assistance: IHBA pairs training, market access and equipment with local ownership so that communities build lasting productive capacity and economic independence. Programmes are planned with communities rather than imposed on them, and judged by the durability of the change they leave behind, not the visibility of the aid itself.",
          ],
          activities: [
            "Skills and livelihoods training programmes",
            "Market assessment and economic opportunity identification",
            "Agricultural and productive capacity development",
            "Equipment provision and technical support",
            "Local trainer development and knowledge transfer",
            "Savings and microfinance groups",
          ],
        },
        {
          title: "Children, Youth and Women",
          blurb:
            "Protective, developmental and participatory education, social support and skills programmes.",
          body: [
            "Programmes reaching children, young people and women are built around protection, safety and dignity — consent, privacy and safeguarding are fundamental to how the work is done, not separate from it. Developed through consultation rather than imposed solutions, they combine protective education, skills development and social support tailored to each group's circumstances.",
          ],
          activities: [
            "Protective and rights-based education",
            "Skills development and economic opportunity",
            "Youth leadership and participation programmes",
            "Women's education and awareness activities",
            "Family-based social support services",
            "Community dialogue and consultation forums",
          ],
        },
        {
          title: "Health and Social Support",
          blurb:
            "Assistance for people in need, disaster-affected communities, displaced persons, older people, persons with disabilities, orphans and those requiring care.",
          body: [
            "This field supports people facing health-related hardship — older people, persons with disabilities, the displaced and disaster-affected, orphans and those requiring care — always respecting their privacy and priorities. IHBA works alongside qualified health and social-care professionals rather than substituting for them, focusing on coordination, access to specialist services and practical accompaniment.",
          ],
          activities: [
            "Coordination with qualified health and care providers",
            "Direct support for older people and persons with disabilities",
            "Assistance to disaster-affected and displaced populations",
            "Care support for children and orphans",
            "Access to specialist health and social services",
            "Accompaniment and information provision",
          ],
        },
        {
          title: "Culture, Arts and Volunteering",
          blurb:
            "Activities that strengthen social solidarity, intercultural communication and volunteer participation.",
          body: [
            "Culture and the arts here are vehicles for dialogue and shared identity, not entertainment — building connections within and between communities. Volunteering is the practical expression of that same solidarity: IHBA welcomes volunteers of every background, whose participation strengthens the work itself and opens space for intercultural exchange.",
          ],
          activities: [
            "Community cultural events and gatherings",
            "Arts and creative expression projects",
            "Cultural dialogue and intercultural communication",
            "Volunteer mobilisation and participation",
            "Performance, music and storytelling activities",
            "Community-led social and cultural initiatives",
          ],
        },
        {
          title: "Institutional Cooperation",
          blurb:
            "Joint initiatives with institutions, representative offices, universities and local partners in different countries.",
          body: [
            "Effective work in distant regions depends on strong local partnerships — with institutions, universities, government bodies and community structures already working there. IHBA assesses each partnership carefully before committing, and treats cooperation as an exchange of knowledge and capacity rather than project delivery alone, building lasting bridges between institutions in different countries.",
          ],
          activities: [
            "Assessment and selection of institutional partners",
            "Formal cooperation agreements with local organisations",
            "University and research partnerships",
            "Cross-border institutional networks and exchanges",
            "Capacity development with partner organisations",
            "Coordinated programme delivery with local institutions",
          ],
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
            "Many children in the region have experienced displacement or poverty that affects their access to meals, a safe place to sleep and basic health care. A comprehensive campus, rather than classrooms alone, is intended to hold those foundations inside the centre itself, so that a child whose circumstances at home are unstable can still learn in a secure and continuous environment.",
            "The preparation is designed to involve families, teachers and local authorities in decisions about the centre's design and its daily operation. Planning covers what a school needs in order to keep running — teaching staff, operating costs, maintenance and repair — rather than construction alone. The design is also intended to give girls and boys equal access to the centre's facilities and programmes, with particular attention to how daily operation will protect and sustain girls' participation.",
            "The campus is intended to serve the wider region as well as its own students. It is planned as a base from which education, skills development and social support can extend to women and girls in the surrounding area. Above all, it is being prepared so that the community regards the centre as its own institution, grounded in local priorities rather than in decisions taken elsewhere.",
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
            "Studying abroad involves more than the decision to go. A student needs to understand how a qualification will be recognised on return, work through unfamiliar application and enrolment procedures, choose a department that matches their own aims rather than accepting whatever place is available, and prepare for the practical reality of arriving in an unfamiliar city — language, accommodation, the cost of living and keeping in touch with family. Guidance is offered at each of these points rather than at the moment of application alone.",
            "The programme works with students rather than for them. That means honest advice, including telling a student when a plan looks unrealistic instead of confirming what they hope to hear; making no promise about admission, scholarships or accommodation that is not IHBA's to give; and treating a student's personal and family circumstances as confidential. Contact is not intended to end at enrolment, since the first year in a new country is usually when support is needed most.",
            "IHBA regards this work as a long-term educational and cultural bridge between Türkiye and Pakistan rather than a placement service. Students who complete their studies are well placed to guide those arriving after them, and the intention is that each group becomes part of the network supporting the next. Relationships built between students, universities and communities in this way outlast any single academic year.",
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
            "Households are identified through local knowledge and existing community relationships rather than by public registration or by whoever happens to arrive on the day. Field partners who live and work in an area know which families are in difficulty, what they already receive and who is likely to stay away — through caution, unfamiliarity with the process, or reluctance to be singled out in front of neighbours. Distribution is then arranged to be orderly and discreet: delivery to homes or through trusted community figures where that is more dignified than a queue, and coordination with other organisations working the same streets so that support is not duplicated while other households are missed.",
            "Where local conditions allow, food and livestock are bought in the area rather than brought in from outside. Buying locally supports the producers, butchers and traders who serve the community all year, avoids undercutting the market that families depend on, and shortens the distance between a donation and the household receiving it. Qurban is organised so that the requirements of the sacrifice are observed properly and the meat reaches those who need it while it is still in good condition, working with suppliers and butchers who understand those obligations.",
            "The season is treated as a beginning rather than a conclusion. What is recorded during Ramadan and Qurban work — which families were reached, in what circumstances, with which children and which longer-term needs — becomes the basis for following those households into education, health or livelihood support afterwards. IHBA is also open about the limit: seasonal assistance, however regular, cannot take the place of year-round programmes. Its value lies in identifying needs and building the relationships through which more sustained support can follow.",
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
    galleryPage: {
      title: "Field Gallery",
      lede:
        "A visual record of shared meals, clean-water work and the people carrying IHBA's work into communities.",
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
    legalPages: {
      kvkk: {
        title: "KVKK Information Notice",
        lede:
          "Information about how IHBA processes and protects personal data under Türkiye's Personal Data Protection Law No. 6698.",
        updatedLabel: "Last updated",
        lastUpdated: "1 August 2026",
        sections: [
          {
            heading: "Data controller",
            paragraphs: [
              "Uluslararası İnsanlık Köprüsü Derneği (IHBA) acts as the data controller for personal data collected through this website and its activities. You can contact us at info@insanlikkoprusu.org or at our registered address in Sultanbeyli, Istanbul.",
            ],
          },
          {
            heading: "Personal data and purposes of processing",
            paragraphs: [
              "Depending on how you contact or support us, we may process identity and contact details, correspondence, volunteer or donation information, and technical records needed to operate the website. We use this data to respond to requests, manage applications and institutional relationships, carry out association activities, meet legal obligations, and protect the security of our services.",
            ],
          },
          {
            heading: "Legal grounds and collection methods",
            paragraphs: [
              "Personal data may be collected electronically through forms, email, telephone and website records, or physically during our activities. It is processed where necessary to establish or perform an agreement, comply with a legal obligation, establish or protect a right, pursue our legitimate interests without harming fundamental rights, or where you have given explicit consent when required.",
            ],
          },
          {
            heading: "Transfers and retention",
            paragraphs: [
              "Data may be shared only where necessary with authorised public bodies, service providers and institutional partners, subject to applicable safeguards. It is retained only for the period required by the processing purpose and applicable law, then deleted, destroyed or anonymised.",
            ],
          },
          {
            heading: "Your rights",
            paragraphs: [
              "Under Article 11 of Law No. 6698, you may ask whether your personal data is processed, request information about processing, learn its purpose and recipients, request correction, deletion or destruction where conditions apply, object to certain automated outcomes, and request compensation for unlawful processing. Requests may be submitted to info@insanlikkoprusu.org with information sufficient to verify your identity and request.",
            ],
          },
        ],
      },
      privacy: {
        title: "Privacy Policy",
        lede:
          "This policy explains the information we collect when you use the IHBA website and how we handle it.",
        updatedLabel: "Last updated",
        lastUpdated: "1 August 2026",
        sections: [
          {
            heading: "Information we collect",
            paragraphs: [
              "We collect information you choose to provide through contact, volunteer and other website forms, including your name, contact details, subject and message. Basic technical information may also be processed to keep the website secure and functioning correctly.",
            ],
          },
          {
            heading: "How we use information",
            paragraphs: [
              "We use personal information to reply to enquiries, manage applications and participation, provide requested information, maintain our records, improve and secure the website, and comply with legal obligations. We do not sell personal information.",
            ],
          },
          {
            heading: "Sharing and service providers",
            paragraphs: [
              "Information is shared only when required for these purposes, with authorised team members, trusted providers supporting our systems, institutional partners involved in a request, or public authorities where legally required. Providers may use information only for the service they deliver to us and under appropriate confidentiality and security duties.",
            ],
          },
          {
            heading: "Retention and security",
            paragraphs: [
              "We keep information only as long as needed for its purpose or applicable record-keeping requirements. We use reasonable organisational and technical measures to protect it, although no internet transmission or storage system can be guaranteed completely secure.",
            ],
          },
          {
            heading: "Your choices and contact",
            paragraphs: [
              "You may request access to, correction of or deletion of your personal information where applicable, or ask questions about this policy, by contacting info@insanlikkoprusu.org. Additional rights available under KVKK are described in our KVKK Information Notice.",
            ],
          },
        ],
      },
      cookies: {
        title: "Cookie Policy",
        lede:
          "This policy describes the limited browser storage used by the IHBA website and how future optional technologies will be handled.",
        updatedLabel: "Last updated",
        lastUpdated: "1 August 2026",
        sections: [
          {
            heading: "What cookies are",
            paragraphs: [
              "Cookies are small text files placed on a device by a website. Similar browser technologies, such as local storage, can remember settings without placing a traditional cookie.",
            ],
          },
          {
            heading: "What this website uses",
            paragraphs: [
              "The website currently uses only storage necessary for core operation and visitor preferences, such as remembering the selected language. We do not currently use analytics, advertising or marketing cookies.",
            ],
          },
          {
            heading: "Future optional cookies",
            paragraphs: [
              "If analytics, advertising or marketing tools are introduced, they will be grouped by purpose and non-essential technologies will not be activated until the visitor has made the required consent choice. Visitors will be able to review and change that choice through a consent interface.",
            ],
          },
          {
            heading: "Managing browser storage",
            paragraphs: [
              "You can remove or block cookies and local storage through your browser settings. Blocking storage required for preferences may cause settings, such as the selected language, not to persist between visits.",
            ],
          },
          {
            heading: "Changes and contact",
            paragraphs: [
              "We may update this policy when the website's technologies or legal requirements change. Questions about browser storage and privacy can be sent to info@insanlikkoprusu.org.",
            ],
          },
        ],
      },
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
      gallery: "Galeri",
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
      principlesTitle: "İlkelerimiz ve kurumsal işleyişimiz",
      principlesLede:
        "İnsani yardım, ancak arkasındaki standartlar kadar güvenilirdir. Aşağıdaki ilkeler; sahada nasıl hareket ettiğimizi, bize emanet edilen kaynakları nasıl yönettiğimizi ve çalışmalarımızın nasıl denetlendiğini belirler.",
      principlesNavLabel: "Bir başlık seçin",
      panels: [
        {
          key: "ethics",
          label: "Etik değerlerimiz",
          heading: "Etik değerlerimiz",
          paragraphs: [
            "IHBA; insanın canını, inancını, aklını, malını ve neslini korumayı temel bir hak olarak görür ve çalışmalarını bu anlayışla düzenler. Yaptığımız her iş, karşımızdaki insanın onurundan başlar: yardım, birinin ihtiyacı olduğu için yapılır; bir ödül, bir teşvik ya da başka bir şeye bağlanmış bir şart olarak asla yapılmaz. Onur ile kolaylık çatıştığında tercihimiz onurdur.",
            "İnsani yardımı yalnızca ihtiyaç esasına göre ulaştırırız. Kime yardım edileceği belirlenirken uyruk, ırk, cinsiyet, dinî inanç, sosyal sınıf ve siyasi görüş hiçbir rol oynamaz. Bir toplulukta ihtiyacı dürüst ve şeffaf biçimde değerlendirir; en acil durumun her zaman en görünür durum olmadığını kabul ederiz.",
            "Faaliyet yürüttüğümüz her yerde siyasi, ekonomik ve askerî hedeflerden bağımsız kalırız. Çatışma ve gerginlik bölgelerinde IHBA taraf tutmaz; siyasi, etnik, mezhepsel veya ideolojik hiçbir tartışmanın parçası olmaz. Bir bölgede bulunmamızın açıklaması ihtiyaçtır, başka bir şey değildir; bu bağımsızlığı erişimi ve güveni mümkün kıldığı için titizlikle koruruz.",
            "Sadece sahada bulunmayı değil, etkili olmayı hedefleriz. Bu; zamanında ve diğer aktörlerle eşgüdüm içinde müdahale etmek, yerel kapasiteyi ikame etmek yerine güçlendirmek ve yardımın istenmeyen etkilerini — bağımlılık, yerel piyasaların bozulması ya da görünmek istemeyen insanların hedef hâline gelmesi — dikkatle düşünmek anlamına gelir. Bir topluluğu bulduğundan daha zayıf bırakacak bir projeyi yürütmeyiz.",
          ],
        },
        {
          key: "integrity",
          label: "Dürüstlük ve çıkar çatışması",
          heading: "Dürüstlük, çıkar çatışması ve gizlilik",
          paragraphs: [
            "IHBA adına hareket eden hiç kimse, bir kararı etkilemesi makul olarak beklenebilecek indirim, hediye, ağırlama veya maddi menfaat kabul edemez; kimse böyle bir teklifte de bulunamaz. Bir çalışanın kararını şüpheye düşürebilecek her ilişki — kişisel, ticari veya kurumsal — karar alındıktan sonra izah edilmek yerine karardan önce beyan edilmelidir.",
            "Birlikte çalıştığımız herkesin mesleki yükümlülüklerine saygı gösteririz: paydaşlar, tedarikçiler, yükleniciler, danışmanlar ve gönüllüler. Hiç kimseden kendi mesleğinin standartlarına aykırı davranmasını istemeyiz; bizimle çalışan kişi ve kuruluşların yeterliliğini, kapasitesini veya geçmiş çalışmalarını olduğundan farklı göstermeyiz.",
            "Çalışmalarımız sırasında öğrendiğimiz bilgiler — yardım alanlar, çalışanlar, paydaşlar veya bağışçılara dair — gizli tutulur; kişisel menfaat için kullanılmaz ve üçüncü kişilerin menfaati için paylaşılmaz. Yardım ulaştırdığımız insanların kişisel verilerini elimizdeki en hassas bilgi olarak ele alırız; çünkü çoğu için görünür olmak gerçek bir risk taşır.",
            "Bunların tümünden hesap verebilir olduğumuzu kabul ederiz. Şikâyet ve eleştiriye açıktır, onları içimizde eritmek yerine cevaplarız: yardım alanlar, bağışçılar, gönüllüler ve paydaşlar bir sorunu iletebilir ve değerlendirilmiş bir yanıt bekleyebilir. Bir hatadan öğrendiklerimiz, yalnızca o hatanın yaşandığı ekipte kalmayacak biçimde kurum içinde paylaşılır ve uygulamayı değiştirir.",
          ],
        },
        {
          key: "compliance",
          label: "Uyum ve risk",
          heading: "Uyum ve risk yönetimi",
          paragraphs: [
            "IHBA, iş süreçlerini Türkiye mevzuatı ve kabul görmüş uluslararası insani yardım standartları çerçevesinde kurar; böylece her bağışın ve her gönüllü emeğinin verildiği amaç doğrultusunda kullanılmasını ve beklenen faydayı üretmesini gözetir. Uyum, iş bittikten sonra doldurulan bir evrak değil, proje tasarımının bir parçasıdır.",
            "Kara para aklama, terörün finansmanı, rüşvet ve yolsuzlukla mücadele politikaları uygular; bunları yalnızca kendimize değil, paydaşlara, tedarikçilere ve transfer kanallarına da uygularız. Kaynaklar belgelenmiş kanallardan aktarılır, paydaşlar sözleşme imzalanmadan önce incelenir ve para ile malzemenin hareketi bağışçıdan varış noktasına kadar izlenebilir kalır.",
            "Risk, bir program başlamadan önce değerlendirilir ve yürürken izlenir: malî, hukukî, operasyonel, itibar ve güvenlik riski — çalışmayı sahada yürüten insanların güvenliği dâhil. Kontroller varsayılmaz, test edilir; zayıflıklar sorumlusu ve süresi belirtilerek kayda geçer ve söylediğimiz işleyiş ile fiilî işleyiş arasında bir açık göründüğünde iç düzenlemelerimizi güncelleriz.",
          ],
        },
        {
          key: "oversight",
          label: "Denetim",
          heading: "Denetim ve gözetim",
          paragraphs: [
            "IHBA'nın hesapları ve faaliyetleri, Türkiye'de dernekler için öngörülen denetime tabidir; buna yetkili kamu kurumlarına yapılan yıllık bildirimler ve malî tabloların denetimi de dâhildir. Kütük, vergi ve MERSİS bilgileri bu sayfada yayımlanır; böylece destek vermeye karar vermeden önce kim olduğumuz doğrulanabilir.",
            "Dış denetimin yanında Yönetim Kurulu, derneğin malî durumunu ve projelerini düzenli olarak gözden geçirir ve genel kurula hesap verir. Harcamalar onaylı bütçeler karşılığında yetkilendirilir, proje giderleri dayanak belgeleriyle karşılaştırılır ve kayıtlar herhangi bir harcamanın hangi karara dayandığı izlenebilecek şekilde tutulur.",
            "Saha çalışması sahada denetlenir. Projeler yerinde ziyaret edilir ve planlananla karşılaştırılır: ne ulaştırıldı, kime, hangi maliyetle ve sonucunda ne değişti. Paydaş kuruluşlar aynı ölçütlerle değerlendirilir. Bir incelemede aksayan bir yön tespit edildiğinde bulgu yazılı hâle getirilir, düzeltme takip edilir ve çıkarılan ders bir raporda kalmayıp sonraki projeye taşınır.",
          ],
        },
      ],
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
      imageAlt: "IHBA Yönetim Kurulu Başkanı Abdullah Serenli",
      photoEnabled: true,
      message: [
        "İnsanlık, coğrafi sınırların ve kültürel farklılıkların ötesinde hepimizin ortak sorumluluğudur. Dünyanın farklı bölgelerinde yaşanan savaşlar, afetler, yoksulluk, göç ve eğitim eşitsizliği; yalnızca kısa süreli yardımları değil, insanı koruyan ve geleceğe hazırlayan kalıcı çözümleri gerekli kılmaktadır.",
        "Uluslararası İnsanlık Köprüsü Derneği'ni, insani yardım çalışmalarını eğitim, sürdürülebilir kalkınma ve güçlü kurumsal iş birlikleriyle buluşturan bir anlayışla kurduk. Amacımız yalnızca bir ihtiyacı geçici olarak karşılamak değil; insanların kendi hayatlarını yeniden inşa edebilecekleri imkânları oluşturmak, toplumlar arasında dayanışmayı güçlendirmek ve kurumlar arasında güvene dayalı köprüler kurmaktır.",
        "Başta Asya ve Afrika olmak üzere ihtiyaç duyulan coğrafyalarda yürüttüğümüz ve geliştirmeyi hedeflediğimiz çalışmalarda insan onuruna saygıyı, şeffaflığı, sürdürülebilirliği ve yerel gerçekliklere uygun hareket etmeyi temel ilke kabul ediyoruz. Manevi değerlerimizden aldığımız sorumlulukla, din, dil, ırk veya coğrafya ayrımı gözetmeden insana ulaşmayı ve iyiliği kalıcı bir değere dönüştürmeyi amaçlıyoruz.",
        "Biliyoruz ki gerçek yardım, yalnızca bugün el uzatmak değil; yarının daha güçlü kurulmasına katkı sunmaktır. Bu yolda gönüllülerimiz, bağışçılarımız, paydaşlarımız ve iş birliği yaptığımız kurumlarla birlikte insanlık için yeni köprüler kurmaya devam edeceğiz.",
      ],
    },
    areasPage: {
      intro: [
        "IHBA yedi alanda çalışır ve bu alanlar bilinçli olarak birbirine bağlıdır. Bu ay gıdaya ihtiyaç duyan bir ailenin, gelecek yıl çocukları için okul sırasına, sonrasında ise geçimini sağlayacak bir imkâna ihtiyacı olabilir. Bu ihtiyaçları birbirinden kopuk programlar olarak ele almak, insanların yardım biçimleri arasında dolaşıp durmasına ve hiçbir zaman bunların ötesine geçememesine yol açar.",
        "Bu nedenle aşağıdaki her alan, IHBA'nın ne yaptığını olduğu kadar nasıl çalıştığını da anlatır: işe başlamadan önce neye baktığını, neyi yapmaktan kaçındığını ve sonraki aşamaya neyi devrettiğini. Bölgenin ihtiyaçları ve güvenilir yerel iş birlikleri imkân verdiğinde bu alanların birkaçı sırayla değil, birlikte yürütülür.",
      ],
      activitiesLabel: "Uygulamada",
      jumpLabel: "Bir alana git",
      title: "Faaliyet alanlarımız",
      lede: "Yedi alan, tek amaç: insan onurunu korumak ve güçlendirmek.",
      items: [
        {
          title: "İnsani Yardım",
          blurb: "Gıda, barınma, sağlık, temel ihtiyaç, ayni ve nakdî destek çalışmaları.",
          body: [
            "İnsani yardım, acil ihtiyaçlara cevap verir: gıda, barınma, sağlık hizmeti ve insanların onurunu koruyarak ayakta kalmasını sağlayan temel malzemeler. IHBA bunu geçici bir yardım değil, uzun vadeli iyileşmeye alan açan bir zemin olarak ele alır; güvenilir yerel paydaşlarla, yalnızca ihtiyaç esasına göre ve mümkün olduğunda eğitim veya geçim programlarıyla birlikte sunar — amaç bağımlılık değil, sürdürülebilir iyileşmedir.",
          ],
          activities: [
            "Gıda dağıtımı ve acil erzak desteği",
            "Acil barınma ve konaklama desteği",
            "Sağlık hizmeti ve tıbbî destek",
            "Temel ihtiyaç ve barınma malzemeleri",
            "Nakdî ve ayni yardım programları",
            "Mevsimsel ve dönemsel acil destek",
          ],
        },
        {
          title: "Eğitim",
          blurb:
            "Burs, öğrenci destek programları, eğitim merkezleri, rehberlik ve farkındalık faaliyetleri.",
          body: [
            "Eğitim, uzun vadeli kalkınmanın ve insan onurunun temelidir; IHBA ilkokuldan yükseköğretime kadar erişimin önündeki engelleri azaltmayı hedefler. Okullar, üniversiteler ve yerel kuruluşlarla birlikte çalışarak eğitim merkezleri kurar, burs sağlar ve rehberlik sunar; mümkün olduğunda bunu geçim kaynakları ve sağlık farkındalığıyla birleştirerek gençlerin ve kadınların hem bilgisini hem özgüvenini geliştirir.",
          ],
          activities: [
            "Temel ve orta öğretim programları",
            "Burs ve öğrencilere maddi destek",
            "Yükseköğretim rehberliği ve danışmanlık",
            "Eğitim merkezleri ve öğrenme alanları",
            "Beceri geliştirme ve meslekî eğitim",
            "Gençler için farkındalık ve rehberlik",
          ],
        },
        {
          title: "Sürdürülebilir Kalkınma",
          blurb:
            "Bireylerin üretim kapasitesini ve ekonomik bağımsızlığını güçlendiren uzun vadeli projeler.",
          body: [
            "Sürdürülebilir kalkınma geçici yardımın ötesine geçer: IHBA eğitimi, pazara erişimi ve yerel sahiplenmeyi bir araya getirerek toplulukların üretim kapasitesini ve ekonomik bağımsızlığını güçlendirir. Projeler topluluğa dayatılmaz, onunla birlikte planlanır ve başarısı yardımın görünürlüğüyle değil, bıraktığı değişimin kalıcılığıyla ölçülür.",
          ],
          activities: [
            "Beceri ve geçim kaynağı geliştirme eğitimleri",
            "Pazar analizi ve fırsat tespiti",
            "Tarım ve üretim kapasitesi geliştirme",
            "Ekipman sağlama ve teknik destek",
            "Yerel eğitimci geliştirme ve bilgi aktarımı",
            "Tasarruf ve küçük ölçekli finans grupları",
          ],
        },
        {
          title: "Çocuk, Gençlik ve Kadın Çalışmaları",
          blurb:
            "Koruyucu, geliştirici ve katılımı artıran eğitim, sosyal destek ve beceri programları.",
          body: [
            "Çocuklara, gençlere ve kadınlara yönelik programlar koruma, güvenlik ve insan onuruna saygı üzerine kurulur; rıza, gizlilik ve en savunmasız olanın korunması işin dışında değil, nasıl yapıldığının esasıdır. IHBA çözümleri dayatmak yerine ailelerle ve topluluklarla istişare eder, koruyucu eğitimi beceri geliştirme ve sosyal destekle birleştirerek her grubun kendine özgü ihtiyaçlarına göre çalışır.",
          ],
          activities: [
            "Koruyucu ve hak temelli eğitim",
            "Beceri geliştirme ve ekonomik fırsat",
            "Gençlik liderliği ve katılım programları",
            "Kadın eğitimi ve farkındalık çalışmaları",
            "Aile temelli sosyal destek hizmetleri",
            "Toplumsal diyalog ve istişare forumları",
          ],
        },
        {
          title: "Sağlık ve Sosyal Destek",
          blurb:
            "İhtiyaç sahibi, afetzede, göçmen, yaşlı, engelli, yetim ve bakıma muhtaç bireylere yönelik destekler.",
          body: [
            "Bu alan, sağlık sorunu yaşayan veya sürekli bakıma ihtiyaç duyan bireylere — yaşlılara, engellilere, afetzedelere, göç etmek zorunda kalanlara, yetimlere ve ihtiyaç sahiplerine — yönelik desteği kapsar; her zaman kişinin gizliliğine ve önceliklerine saygı gösterilir. IHBA nitelikli uzmanların yerine geçmeye çalışmaz; eşgüdüm sağlamaya, doğru hizmete ulaştırmaya ve süreç boyunca yanında olmaya odaklanır.",
          ],
          activities: [
            "Nitelikli sağlık ve bakım sağlayıcılarıyla koordinasyon",
            "Yaşlı ve engelli kişilere doğrudan destek",
            "Afetzede ve göçmen nüfusa yardım",
            "Çocuk ve yetim bakımı desteği",
            "Uzman sağlık ve sosyal hizmetlere erişim",
            "Rehberlik ve bilgi sağlama hizmetleri",
          ],
        },
        {
          title: "Kültür, Sanat ve Gönüllülük",
          blurb:
            "Toplumsal dayanışmayı, kültürler arası iletişimi ve gönüllü katılımını güçlendiren çalışmalar.",
          body: [
            "Kültür ve sanat burada gösteri değil, ortak ifade, diyalog ve katılım aracıdır; topluluklar içinde ve arasında bağ kurar. Gönüllülük bu dayanışmanın en somut hâlidir — IHBA farklı beceri ve geçmişe sahip gönüllülere açıktır ve bu katılımın hem çalışmayı güçlendirdiğine hem de kültürler arası öğrenmeye alan açtığına inanır.",
          ],
          activities: [
            "Toplum kültür etkinlikleri ve buluşmaları",
            "Sanat ve yaratıcı ifade projeleri",
            "Kültürel diyalog ve kültürler arası iletişim",
            "Gönüllü katılımı ve organizasyonu",
            "Müzik, sahne sanatları ve hikâye anlatıcılığı",
            "Toplum liderliğinde sosyal ve kültürel girişimler",
          ],
        },
        {
          title: "Kurumsal İş Birlikleri",
          blurb:
            "Farklı ülkelerdeki kurumlar, temsilcilikler, üniversiteler ve yerel paydaşlarla ortak projeler.",
          body: [
            "Uzak bölgelerde etkili çalışmak güçlü ortaklıklar gerektirir — yerel kuruluşlar, üniversiteler, kamu kurumları ve zaten sahada olan toplum yapılarıyla. IHBA her ortaklığı imzadan önce dikkatle değerlendirir ve iş birliğini proje yürütmenin ötesinde, bilgi ve kapasitenin iki yönlü paylaşıldığı, kurumlar arasında kalıcı köprüler kuran bir ilişki olarak ele alır.",
          ],
          activities: [
            "Kurumsal paydaşların değerlendirilmesi ve seçimi",
            "Yerel kuruluşlarla resmî iş birliği anlaşmaları",
            "Üniversite ve araştırma ortaklıkları",
            "Sınır ötesi kurumsal ağlar ve değişim programları",
            "Paydaş kuruluşlarla kapasite geliştirme",
            "Yerel kurumlarla eşgüdüm içinde program yürütümü",
          ],
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
            "Bölgedeki birçok çocuk; beslenmeye, güvenli bir barınma imkânına ve temel sağlık hizmetlerine erişimini etkileyen göç veya yoksulluk tecrübesi yaşamıştır. Yalnızca sınıflardan oluşan bir okul yerine bütüncül bir yerleşke planlanmasının amacı, bu temel ihtiyaçları merkezin kendi bünyesinde karşılamaktır; böylece ev şartları istikrarsız olan bir çocuk da güvenli ve kesintisiz bir ortamda öğrenmeye devam edebilir.",
            "Hazırlık süreci; merkezin tasarımına ve günlük işleyişine dair kararlarda ailelerin, öğretmenlerin ve yerel yetkililerin görüşünü içerecek şekilde kurgulanmıştır. Planlama yalnızca inşaatı değil, bir okulun ayakta kalabilmesi için gerekenleri de kapsar: öğretim kadrosu, işletme giderleri, bakım ve onarım. Tasarımda kız ve erkek öğrencilerin merkezin imkânlarına ve programlarına eşit erişimi hedeflenir; günlük işleyişin kız öğrencilerin katılımını koruyacak ve sürdürecek biçimde düzenlenmesine ayrıca önem verilir.",
            "Yerleşkenin yalnızca kendi öğrencilerine değil, çevre bölgeye de hizmet etmesi amaçlanmaktadır. Eğitimin, beceri geliştirmenin ve sosyal desteğin bölgedeki kadınlara ve kız çocuklarına ulaşabileceği bir merkez olarak planlanmaktadır. Her şeyden önce merkez; toplumun onu başka yerlerde alınmış kararların değil, kendi önceliklerinin ürünü olan bir kurum olarak görmesi gözetilerek hazırlanmaktadır.",
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
            "Yurt dışında okumak, gitme kararından çok daha fazlasını gerektirir. Öğrencinin; alacağı diplomanın dönüşte nasıl tanınacağını anlaması, alışık olmadığı başvuru ve kayıt işlemlerini yürütmesi, açık olan herhangi bir bölüme değil kendi hedeflerine uygun bir bölüme yönelmesi ve yeni bir şehre varmanın pratik gerçeğine hazırlanması gerekir: dil, barınma, yaşam maliyeti ve aileyle irtibatın sürdürülmesi. Rehberlik yalnızca başvuru anında değil, bu başlıkların her birinde sunulur.",
            "Program, öğrenciler adına değil öğrencilerle birlikte yürütülür. Bu; bir planın gerçekçi görünmediği durumlarda öğrencinin duymak istediğini onaylamak yerine bunu açıkça söylemek, derneğin elinde olmayan kabul, burs veya barınma konularında söz vermemek ve öğrencinin kişisel ve ailevî durumunu gizli tutmak anlamına gelir. İrtibatın kayıt işlemiyle sona ermemesi esastır; çünkü yeni bir ülkedeki ilk yıl, desteğe en çok ihtiyaç duyulan dönemdir.",
            "IHBA bu çalışmayı bir öğrenci yerleştirme hizmeti değil, Türkiye ile Pakistan arasında uzun vadeli bir eğitim ve kültür köprüsü olarak görür. Eğitimini tamamlayan öğrenciler, kendilerinden sonra gelenlere yol göstermek için en uygun konumdadır; amaç, her grubun bir sonrakini destekleyen ağın parçası hâline gelmesidir. Öğrenciler, üniversiteler ve topluluklar arasında bu yolla kurulan ilişkiler tek bir öğretim yılının ötesine geçer.",
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
            "Yardım ulaştırılacak haneler; ilan edilmiş bir kayıt sistemiyle veya o gün kim gelirse ona göre değil, yerel bilgi ve mevcut topluluk ilişkileri üzerinden belirlenir. Bölgede yaşayan ve çalışan saha ortakları hangi ailelerin güçlük içinde olduğunu, hâlihazırda hangi destekleri aldığını ve kimlerin geri durma ihtimalinin yüksek olduğunu bilir; bu geri durma çekingenlikten, süreci tanımamaktan veya komşularının önünde işaret edilmek istememekten kaynaklanır. Dağıtım da düzenli ve göze batmayacak biçimde kurgulanır: sıraya girmekten daha onurlu olduğu durumlarda yardım eve teslim edilir veya toplumun güvendiği kişiler aracılığıyla ulaştırılır; aynı mahallede çalışan diğer kuruluşlarla eşgüdüm sağlanarak bazı hanelere iki kez ulaşılırken diğerlerinin atlanması önlenir.",
            "Yerel şartlar imkân verdiğinde gıda ve kurbanlık hayvan, dışarıdan getirilmek yerine bölgeden temin edilir. Yerelden almak; topluluğa yıl boyunca hizmet eden üreticiyi, kasabı ve esnafı destekler, ailelerin geçimini bağladığı piyasayı zayıflatmaz ve bağış ile yardımı alan hane arasındaki mesafeyi kısaltır. Kurban organizasyonu; ibadetin gereklerinin usulüne uygun yerine getirilmesi ve etin bozulmadan ihtiyaç sahibine ulaşması gözetilerek, bu yükümlülükleri bilen tedarikçi ve kasaplarla yürütülür.",
            "Dönem, bir bitiş değil bir başlangıç olarak ele alınır. Ramazan ve Kurban çalışmaları sırasında kaydedilenler — hangi ailelere ulaşıldığı, hangi şartlarda, hangi çocuklarla ve hangi uzun vadeli ihtiyaçlarla — bu hanelerin sonrasında eğitim, sağlık veya geçim desteğiyle takip edilmesinin temelini oluşturur. IHBA sınırı da açıkça ifade eder: dönemsel yardım, ne kadar düzenli olursa olsun yıl boyu süren programların yerini alamaz. Değeri, ihtiyaçları tespit etmesinde ve daha kalıcı desteğin gelişebileceği ilişkileri kurmasındadır.",
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
    galleryPage: {
      title: "Saha Galerisi",
      lede:
        "Paylaşılan sofraların, temiz su çalışmalarının ve IHBA'nın hizmetini topluluklara ulaştıran insanların görsel kaydı.",
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
    legalPages: {
      kvkk: {
        title: "KVKK Aydınlatma Metni",
        lede:
          "IHBA'nın kişisel verileri 6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında nasıl işlediğine ve koruduğuna ilişkin bilgilendirme.",
        updatedLabel: "Son güncelleme",
        lastUpdated: "1 Ağustos 2026",
        sections: [
          {
            heading: "Veri sorumlusu",
            paragraphs: [
              "Uluslararası İnsanlık Köprüsü Derneği (IHBA), bu internet sitesi ve faaliyetleri kapsamında toplanan kişisel veriler bakımından veri sorumlusudur. Bize info@insanlikkoprusu.org adresinden veya Sultanbeyli, İstanbul'daki kayıtlı adresimizden ulaşabilirsiniz.",
            ],
          },
          {
            heading: "İşlenen veriler ve işleme amaçları",
            paragraphs: [
              "Bizimle kurduğunuz iletişime ve sunduğunuz desteğe göre kimlik ve iletişim bilgileri, yazışmalar, gönüllülük veya bağış bilgileri ile internet sitesinin çalışması için gereken teknik kayıtlar işlenebilir. Bu veriler; talepleri yanıtlamak, başvuruları ve kurumsal ilişkileri yönetmek, dernek faaliyetlerini yürütmek, hukuki yükümlülükleri yerine getirmek ve hizmetlerimizin güvenliğini sağlamak amacıyla kullanılır.",
            ],
          },
          {
            heading: "Hukuki sebepler ve toplama yöntemleri",
            paragraphs: [
              "Kişisel veriler; formlar, e-posta, telefon ve internet sitesi kayıtları üzerinden elektronik ortamda veya faaliyetlerimiz sırasında fiziksel ortamda toplanabilir. Veriler; bir sözleşmenin kurulması veya ifası, hukuki yükümlülüğün yerine getirilmesi, bir hakkın tesisi veya korunması, temel haklara zarar vermeyen meşru menfaatlerimiz ya da gerekli hâllerde açık rızanız hukuki sebeplerine dayanılarak işlenir.",
            ],
          },
          {
            heading: "Aktarım ve saklama",
            paragraphs: [
              "Veriler yalnızca gerekli olduğu ölçüde ve uygun güvenceler altında yetkili kamu kurumları, hizmet sağlayıcılar ve kurumsal paydaşlarla paylaşılabilir. İşleme amacı ve ilgili mevzuatın gerektirdiği süre boyunca saklanır; sürenin sonunda silinir, yok edilir veya anonim hâle getirilir.",
            ],
          },
          {
            heading: "Haklarınız",
            paragraphs: [
              "6698 sayılı Kanun'un 11. maddesi uyarınca kişisel verilerinizin işlenip işlenmediğini öğrenme, işleme hakkında bilgi talep etme, amacı ve aktarıldığı kişileri öğrenme, şartları oluştuğunda düzeltme, silme veya yok etme talep etme, belirli otomatik sonuçlara itiraz etme ve hukuka aykırı işleme nedeniyle zararın giderilmesini isteme haklarına sahipsiniz. Başvurularınızı kimliğinizi ve talebinizi doğrulamaya yeterli bilgilerle info@insanlikkoprusu.org adresine iletebilirsiniz.",
            ],
          },
        ],
      },
      privacy: {
        title: "Gizlilik Politikası",
        lede:
          "Bu politika, IHBA internet sitesini kullandığınızda hangi bilgileri topladığımızı ve bu bilgileri nasıl yönettiğimizi açıklar.",
        updatedLabel: "Son güncelleme",
        lastUpdated: "1 Ağustos 2026",
        sections: [
          {
            heading: "Topladığımız bilgiler",
            paragraphs: [
              "İletişim, gönüllülük ve diğer internet sitesi formları üzerinden paylaşmayı tercih ettiğiniz ad, iletişim bilgileri, konu ve mesaj gibi bilgileri toplarız. İnternet sitesinin güvenli ve düzgün çalışmasını sağlamak için temel teknik bilgiler de işlenebilir.",
            ],
          },
          {
            heading: "Bilgileri nasıl kullanırız",
            paragraphs: [
              "Kişisel bilgileri taleplere yanıt vermek, başvuruları ve katılım süreçlerini yönetmek, istenen bilgileri sunmak, kayıtlarımızı tutmak, internet sitesini geliştirmek ve güvenliğini sağlamak ile hukuki yükümlülükleri yerine getirmek amacıyla kullanırız. Kişisel bilgileri satmayız.",
            ],
          },
          {
            heading: "Paylaşım ve hizmet sağlayıcılar",
            paragraphs: [
              "Bilgiler yalnızca bu amaçlar için gerektiğinde yetkili ekip üyeleri, sistemlerimizi destekleyen güvenilir hizmet sağlayıcılar, talebe dahil olan kurumsal paydaşlar veya hukuken zorunlu hâllerde kamu kurumlarıyla paylaşılır. Hizmet sağlayıcılar bilgileri yalnızca bize sundukları hizmet için ve uygun gizlilik ile güvenlik yükümlülükleri altında kullanabilir.",
            ],
          },
          {
            heading: "Saklama ve güvenlik",
            paragraphs: [
              "Bilgileri yalnızca amacı veya geçerli kayıt saklama yükümlülükleri için gereken süre boyunca tutarız. Korumak için makul idari ve teknik önlemler uygularız; ancak hiçbir internet iletimi veya depolama sisteminin tamamen güvenli olduğu garanti edilemez.",
            ],
          },
          {
            heading: "Tercihleriniz ve iletişim",
            paragraphs: [
              "Uygulanabildiği ölçüde kişisel bilgilerinize erişim, düzeltme veya silme talebinde bulunabilir ya da bu politikaya ilişkin sorularınızı info@insanlikkoprusu.org adresine iletebilirsiniz. KVKK kapsamındaki diğer haklarınız KVKK Aydınlatma Metnimizde açıklanmıştır.",
            ],
          },
        ],
      },
      cookies: {
        title: "Çerez Politikası",
        lede:
          "Bu politika, IHBA internet sitesinde kullanılan sınırlı tarayıcı depolamasını ve gelecekte isteğe bağlı teknolojilerin nasıl yönetileceğini açıklar.",
        updatedLabel: "Son güncelleme",
        lastUpdated: "1 Ağustos 2026",
        sections: [
          {
            heading: "Çerez nedir?",
            paragraphs: [
              "Çerezler, bir internet sitesi tarafından cihazınıza yerleştirilen küçük metin dosyalarıdır. Yerel depolama gibi benzer tarayıcı teknolojileri de geleneksel bir çerez oluşturmadan tercihleri hatırlayabilir.",
            ],
          },
          {
            heading: "Bu internet sitesinde kullanılanlar",
            paragraphs: [
              "İnternet sitesi şu anda yalnızca temel işlevler ve ziyaretçi tercihleri için gereken depolamayı, örneğin seçilen dili hatırlamayı, kullanır. Şu anda analiz, reklam veya pazarlama çerezleri kullanmıyoruz.",
            ],
          },
          {
            heading: "Gelecekte kullanılabilecek isteğe bağlı çerezler",
            paragraphs: [
              "Analiz, reklam veya pazarlama araçları eklenirse bunlar amaçlarına göre gruplandırılacak ve zorunlu olmayan teknolojiler, ziyaretçi gerekli onay tercihini yapmadan etkinleştirilmeyecektir. Ziyaretçiler tercihlerini bir onay arayüzü üzerinden inceleyebilecek ve değiştirebilecektir.",
            ],
          },
          {
            heading: "Tarayıcı depolamasını yönetme",
            paragraphs: [
              "Çerezleri ve yerel depolamayı tarayıcı ayarlarınız üzerinden silebilir veya engelleyebilirsiniz. Tercihler için gerekli depolamayı engellemeniz, seçilen dil gibi ayarların ziyaretler arasında korunmamasına neden olabilir.",
            ],
          },
          {
            heading: "Değişiklikler ve iletişim",
            paragraphs: [
              "İnternet sitesinde kullanılan teknolojiler veya hukuki gereklilikler değiştiğinde bu politikayı güncelleyebiliriz. Tarayıcı depolaması ve gizlilik hakkındaki sorularınızı info@insanlikkoprusu.org adresine iletebilirsiniz.",
            ],
          },
        ],
      },
    },
  },
};
