import { eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import { newsArticles, newsTranslations } from "../lib/db/schema";

const slug = "why-local-partnerships-matter-in-humanitarian-work";
const fallbackId = `news_${slug}`;

const english = {
  locale: "en" as const,
  title: "Why Local Partnerships Matter in Humanitarian Work",
  excerpt:
    "Lasting humanitarian work begins with listening. Local partnerships help organisations understand real needs, act responsibly and strengthen communities from within.",
  imageAlt:
    "Community representatives and humanitarian workers planning together",
  body: [
    "Humanitarian organisations often work in places shaped by crisis, poverty, displacement or limited access to essential services. The desire to help may cross borders, but effective action must always begin with a clear understanding of the people and place concerned.",
    "No organisation can gain that understanding from reports and statistics alone. Local communities know their own challenges, strengths, customs and priorities better than anyone else. Working with trusted local partners is therefore not simply a practical arrangement; it is one of the foundations of responsible humanitarian action.",
    "## Listening before acting",
    "Good intentions do not automatically produce good outcomes. A project may appear valuable from a distance while failing to address the community’s most urgent concern. In other cases, an otherwise useful programme may be delivered at the wrong time, in the wrong place or in a form that people cannot easily access.",
    "Local organisations, educators, health workers, community leaders and volunteers can help identify what is genuinely needed. Their knowledge makes it possible to ask better questions before resources are committed: Who is being left out? What support already exists? Which barriers are preventing people from accessing it? What would a useful and respectful response look like?",
    "Listening is not a delay in humanitarian work. It is part of the work itself. It helps organisations avoid assumptions and design responses around reality rather than expectation.",
    "## Reaching people with dignity",
    "Humanitarian assistance is not only about what is delivered. The way support reaches people also matters. Distribution processes should protect privacy, reduce unnecessary waiting and ensure that people are treated with fairness and respect.",
    "Trusted local partners understand how communities communicate and where vulnerable groups may face difficulty. They can help make programmes more accessible to older people, persons with disabilities, displaced families, women, children and others who might otherwise be overlooked.",
    "Their involvement can also reduce misunderstandings. Clear communication in the local language allows people to understand what support is available, who it is intended for and how decisions are made. This strengthens both dignity and trust.",
    "## Adapting to local realities",
    "Every community has its own social, cultural, economic and geographic conditions. A solution that works well in one location may not work in another. Even neighbouring communities can have very different needs.",
    "Local partners help humanitarian organisations adapt their methods. They may advise on suitable locations, seasonal conditions, transportation challenges, school schedules, dietary practices or community customs. These details can determine whether a programme is merely well intentioned or genuinely effective.",
    "Adaptation does not mean abandoning standards. Accountability, safeguarding, transparency and equal treatment remain essential everywhere. It means applying those principles in a way that is practical, understandable and appropriate to the local context.",
    "## Building trust and accountability",
    "Trust cannot be imported or created through a single visit. It develops through consistent behaviour, honest communication and visible responsibility.",
    "Local organisations often have relationships that were built long before an international partner arrived and will continue after a particular project ends. When these organisations are carefully assessed and supported, their community relationships can make humanitarian programmes more transparent and responsive.",
    "Partnership also creates opportunities for accountability in both directions. Local partners can explain community concerns to supporting organisations, while supporting organisations can establish clear standards for safeguarding, financial management, reporting and the responsible use of resources.",
    "Strong partnerships should welcome questions. Communities deserve to know how decisions are made, and donors deserve to know how resources are used.",
    "## Responding faster during emergencies",
    "During an emergency, time matters. Local organisations are often among the first to understand what has happened because they are already present. They know the roads, institutions, gathering points and communication networks.",
    "This local presence can help identify urgent needs and organise an early response while larger systems are still mobilising. It can also provide continuity after public attention begins to move elsewhere.",
    "Speed, however, should not replace verification. Responsible organisations must still assess information, coordinate with relevant authorities and protect people from harm. The advantage of local partnership is that speed and understanding can work together.",
    "## Strengthening capacity for the future",
    "The best partnerships do more than use local organisations as delivery channels. They invest in their ability to lead.",
    "Training, shared planning, technical support and fair access to resources can strengthen local institutions. Over time, this can improve their ability to manage projects, respond to emergencies, protect vulnerable people and develop solutions independently.",
    "This approach recognises that communities are not passive recipients of outside assistance. They already possess knowledge, experience and capacity. Humanitarian cooperation should help those strengths grow rather than replace them.",
    "## From short-term support to lasting progress",
    "A food distribution, scholarship programme or health activity may begin as a response to an immediate need. Through trusted local relationships, it can also reveal deeper challenges and opportunities.",
    "A seasonal assistance programme might lead to longer-term support for families. An education activity might identify the need for teacher development, student accommodation or vocational skills. A health campaign might create stronger links between communities and local services.",
    "Local partnership helps humanitarian organisations see this wider picture. It connects immediate support with the patient work of strengthening resilience and independence.",
    "## Building bridges that last",
    "Humanitarian work is strongest when it combines resources from beyond a community with knowledge and leadership from within it. Neither side should act alone.",
    "A meaningful partnership is based on shared responsibility, clear expectations, mutual respect and a commitment to learning. It does not remove every difficulty, but it creates a better foundation for addressing challenges honestly and effectively.",
    "Lasting change is rarely delivered from the outside. It is built together—with people who understand their communities, care about their future and remain present for the long journey ahead.",
  ],
};

const turkish = {
  locale: "tr" as const,
  title: "İnsani Yardım Çalışmalarında Yerel Ortaklıklar Neden Önemlidir?",
  excerpt:
    "Kalıcı insani çalışmalar dinlemekle başlar. Yerel ortaklıklar, gerçek ihtiyaçları anlamaya, sorumlu hareket etmeye ve toplumları içeriden güçlendirmeye yardımcı olur.",
  imageAlt:
    "Birlikte planlama yapan toplum temsilcileri ve insani yardım çalışanları",
  body: [
    "İnsani yardım kuruluşları çoğu zaman kriz, yoksulluk, göç veya temel hizmetlere sınırlı erişimle şekillenen bölgelerde çalışır. Yardım etme arzusu sınırları aşabilir; ancak etkili bir çalışma her zaman ilgili insanları ve bölgeyi doğru anlamakla başlamalıdır.",
    "Hiçbir kuruluş bu anlayışı yalnızca raporlardan ve istatistiklerden elde edemez. Yerel toplumlar kendi sorunlarını, güçlü yönlerini, geleneklerini ve önceliklerini herkesten daha iyi bilir. Bu nedenle güvenilir yerel ortaklarla çalışmak yalnızca pratik bir yöntem değil, sorumlu insani çalışmanın temel unsurlarından biridir.",
    "## Harekete geçmeden önce dinlemek",
    "İyi niyetler kendiliğinden iyi sonuçlar doğurmaz. Uzaktan bakıldığında değerli görünen bir proje, toplumun en acil sorununa cevap vermeyebilir. Başka durumlarda faydalı bir program yanlış zamanda, yanlış yerde veya insanların kolayca erişemeyeceği bir biçimde uygulanabilir.",
    "Yerel kuruluşlar, eğitimciler, sağlık çalışanları, toplum liderleri ve gönüllüler gerçek ihtiyaçların belirlenmesine yardımcı olabilir. Onların bilgisi, kaynaklar kullanılmadan önce daha doğru sorular sorulmasını sağlar: Kimler dışarıda kalıyor? Hangi destekler zaten mevcut? İnsanların bu desteklere erişmesini engelleyen nedir? Faydalı ve saygılı bir çözüm nasıl olmalıdır?",
    "Dinlemek, insani çalışmayı geciktiren bir süreç değildir; çalışmanın kendisinin bir parçasıdır. Kuruluşların varsayımlardan kaçınmasına ve beklentiler yerine gerçeklere dayanan çözümler geliştirmesine yardımcı olur.",
    "## İnsanlara onurlarını koruyarak ulaşmak",
    "İnsani yardım yalnızca neyin ulaştırıldığıyla ilgili değildir. Desteğin insanlara nasıl ulaştığı da önemlidir. Dağıtım süreçleri mahremiyeti korumalı, gereksiz beklemeyi azaltmalı ve insanların adalet ve saygıyla karşılanmasını sağlamalıdır.",
    "Güvenilir yerel ortaklar, toplumların nasıl iletişim kurduğunu ve savunmasız grupların nerelerde güçlük yaşayabileceğini bilir. Yaşlıların, engellilerin, yerinden edilmiş ailelerin, kadınların, çocukların ve gözden kaçabilecek diğer kişilerin programlara erişimini kolaylaştırabilirler.",
    "Yerel katılım yanlış anlaşılmaları da azaltabilir. Yerel dilde açık iletişim, insanların hangi desteğin mevcut olduğunu, kimlere yönelik olduğunu ve kararların nasıl alındığını anlamasını sağlar. Bu da hem insan onurunu hem güveni güçlendirir.",
    "## Yerel gerçekliklere uyum sağlamak",
    "Her toplumun kendine özgü sosyal, kültürel, ekonomik ve coğrafi koşulları vardır. Bir yerde başarılı olan çözüm başka bir yerde işe yaramayabilir. Birbirine komşu toplumların bile ihtiyaçları oldukça farklı olabilir.",
    "Yerel ortaklar, insani yardım kuruluşlarının çalışma yöntemlerini uyarlamasına yardımcı olur. Uygun yerler, mevsimsel şartlar, ulaşım zorlukları, okul takvimleri, beslenme alışkanlıkları veya toplumsal gelenekler hakkında yol gösterebilirler. Bu ayrıntılar bir programın yalnızca iyi niyetli mi yoksa gerçekten etkili mi olacağını belirleyebilir.",
    "Uyum sağlamak, standartlardan vazgeçmek anlamına gelmez. Hesap verebilirlik, güvenlik, şeffaflık ve eşit muamele her yerde vazgeçilmezdir. Uyum; bu ilkeleri yerel bağlama uygun, anlaşılır ve uygulanabilir bir biçimde hayata geçirmek demektir.",
    "## Güven ve hesap verebilirlik oluşturmak",
    "Güven dışarıdan getirilemez veya tek bir ziyaretle oluşturulamaz. Tutarlı davranış, dürüst iletişim ve görünür sorumlulukla zaman içinde gelişir.",
    "Yerel kuruluşların ilişkileri çoğu zaman uluslararası bir ortak gelmeden çok önce kurulmuştur ve belirli bir proje sona erdikten sonra da devam eder. Dikkatle değerlendirilen ve desteklenen yerel kuruluşların toplumla kurduğu ilişkiler, insani programların daha şeffaf ve duyarlı olmasını sağlayabilir.",
    "Ortaklık iki yönlü hesap verebilirlik fırsatı da oluşturur. Yerel ortaklar toplumun endişelerini destek veren kuruluşlara aktarabilir; destek veren kuruluşlar ise güvenlik, mali yönetim, raporlama ve kaynakların sorumlu kullanımı konusunda açık standartlar belirleyebilir.",
    "Güçlü ortaklıklar sorulara açık olmalıdır. Toplumlar kararların nasıl alındığını, bağışçılar ise kaynakların nasıl kullanıldığını bilme hakkına sahiptir.",
    "## Acil durumlarda daha hızlı karşılık vermek",
    "Acil durumlarda zaman önemlidir. Yerel kuruluşlar bölgede zaten bulundukları için ne olduğunu ilk anlayanlar arasında yer alır. Yolları, kurumları, toplanma alanlarını ve iletişim ağlarını bilirler.",
    "Bu yerel varlık, daha büyük sistemler harekete geçerken acil ihtiyaçların belirlenmesine ve ilk müdahalenin düzenlenmesine yardımcı olabilir. Kamuoyunun ilgisi başka konulara yönelmeye başladıktan sonra da devamlılık sağlayabilir.",
    "Ancak hız, doğrulamanın yerini almamalıdır. Sorumlu kuruluşlar bilgileri değerlendirmeli, ilgili makamlarla koordinasyon kurmalı ve insanları zarardan korumalıdır. Yerel ortaklığın avantajı, hız ile anlayışın birlikte çalışabilmesidir.",
    "## Gelecek için kapasiteyi güçlendirmek",
    "En iyi ortaklıklar yerel kuruluşları yalnızca dağıtım kanalı olarak kullanmaz; onların liderlik kapasitesine yatırım yapar.",
    "Eğitim, ortak planlama, teknik destek ve kaynaklara adil erişim yerel kurumları güçlendirebilir. Bu kurumlar zaman içinde proje yönetme, acil durumlara cevap verme, savunmasız kişileri koruma ve bağımsız çözümler geliştirme becerilerini ilerletebilir.",
    "Bu yaklaşım, toplumların dışarıdan yardım alan pasif gruplar olmadığını kabul eder. Yerel toplumlar zaten bilgiye, deneyime ve kapasiteye sahiptir. İnsani iş birliği bu güçlü yönlerin yerini almak yerine gelişmesine yardımcı olmalıdır.",
    "## Kısa vadeli destekten kalıcı ilerlemeye",
    "Bir gıda dağıtımı, burs programı veya sağlık faaliyeti acil bir ihtiyaca cevap olarak başlayabilir. Güvenilir yerel ilişkiler sayesinde daha derin sorunları ve fırsatları da görünür hâle getirebilir.",
    "Dönemsel bir yardım programı ailelere yönelik uzun vadeli desteğe dönüşebilir. Bir eğitim faaliyeti öğretmen gelişimi, öğrenci barınması veya mesleki becerilere duyulan ihtiyacı ortaya çıkarabilir. Bir sağlık kampanyası toplumlarla yerel hizmetler arasında daha güçlü bağlar kurabilir.",
    "Yerel ortaklık, insani yardım kuruluşlarının bu geniş çerçeveyi görmesine yardımcı olur. Acil desteği, dayanıklılığı ve bağımsızlığı güçlendiren sabırlı çalışmalarla buluşturur.",
    "## Kalıcı köprüler kurmak",
    "İnsani çalışma, toplum dışından gelen kaynaklarla toplumun içindeki bilgi ve liderliği birleştirdiğinde en güçlü hâline gelir. Taraflardan hiçbiri tek başına hareket etmemelidir.",
    "Anlamlı bir ortaklık; ortak sorumluluğa, açık beklentilere, karşılıklı saygıya ve öğrenme iradesine dayanır. Her güçlüğü ortadan kaldırmaz; ancak sorunları dürüst ve etkili biçimde ele almak için daha sağlam bir temel oluşturur.",
    "Kalıcı değişim çoğu zaman dışarıdan teslim edilmez. Toplumunu anlayan, geleceğini önemseyen ve uzun yolculuk boyunca varlığını sürdüren insanlarla birlikte inşa edilir.",
  ],
};

async function main() {
  const existing = await db.query.newsArticles.findFirst({
    where: eq(newsArticles.slug, slug),
  });
  const id = existing?.id ?? fallbackId;
  const now = new Date();

  await db.transaction(async (tx) => {
    await tx
      .insert(newsArticles)
      .values({
        id,
        slug,
        state: "published",
        publishedAt: existing?.publishedAt ?? now,
      })
      .onConflictDoUpdate({
        target: newsArticles.id,
        set: {
          slug,
          state: "published",
          publishedAt: existing?.publishedAt ?? now,
          updatedAt: now,
        },
      });

    for (const translation of [turkish, english]) {
      await tx
        .insert(newsTranslations)
        .values({ articleId: id, ...translation })
        .onConflictDoUpdate({
          target: [
            newsTranslations.articleId,
            newsTranslations.locale,
          ],
          set: translation,
        });
    }
  });

  console.log(`Published /news/${slug}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
