import { eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import { newsArticles, newsTranslations } from "../lib/db/schema";

const slug = "why-education-is-powerful-humanitarian-support";
const fallbackId = `news_${slug}`;

const english = {
  locale: "en" as const,
  title:
    "Why Education Is One of the Most Powerful Forms of Humanitarian Support",
  excerpt:
    "Emergency relief protects people today. Education gives them the knowledge, confidence and opportunities to build a more secure tomorrow.",
  imageAlt: "Students learning together in a supportive classroom",
  body: [
    "When people think about humanitarian assistance, they often imagine food parcels, clean water, medicine, shelter and emergency supplies. These forms of support are essential. During war, displacement, natural disasters or severe poverty, meeting immediate needs can protect lives and restore a basic sense of security.",
    "Humanitarian responsibility, however, does not end when the immediate crisis passes. Communities also need opportunities to recover, rebuild and prepare for the future. This is where education becomes one of the most powerful and lasting forms of humanitarian support.",
    "## Education creates opportunities",
    "For children and young people, education can open doors that poverty and displacement might otherwise keep closed. It develops literacy, knowledge, confidence, communication and problem-solving skills. These abilities help students make informed decisions and participate more fully in their communities.",
    "A child who receives a quality education gains more than academic knowledge. Education can give that child the confidence to imagine a different future—and the practical ability to pursue it.",
    "Its benefits are not limited to one person. An educated individual can support a family, contribute to the local economy, share knowledge with others and help strengthen an entire community. Investment in education can therefore continue producing benefits for generations.",
    "## A safe place to grow",
    "Schools and education centres can provide stability during uncertain times. For children affected by conflict, disaster, poverty or displacement, a consistent learning environment can restore routine and a sense of normality.",
    "A supportive educational environment can also offer protection. Teachers and community workers may notice when a child is facing neglect, exploitation, emotional distress or other risks. When education programmes are designed responsibly, they can connect vulnerable children and families with appropriate support.",
    "Education should therefore be understood as more than lessons delivered in a classroom. It should provide a safe and respectful space where children can develop socially, emotionally, morally and intellectually.",
    "## Helping communities become more independent",
    "Emergency assistance responds to what people need today. Education helps people prepare for tomorrow.",
    "Scholarships, vocational training, university guidance, language education and practical skills programmes can help people become more independent. They may enable young adults to find employment, support their families, establish businesses or serve their communities.",
    "This does not make emergency aid less important. Food, shelter, healthcare and protection remain essential wherever urgent needs exist. The strongest humanitarian approach brings immediate assistance and long-term development together.",
    "A food parcel may help a family through a difficult period. Education and skills training can help that family build greater stability for the years ahead. Both forms of support have value, but they serve different stages of recovery.",
    "## Education must reflect local realities",
    "Effective education programmes cannot be designed from a distance without understanding the people they are intended to serve. Every community has its own language, culture, values, economic circumstances and educational needs.",
    "Programmes should therefore be developed in consultation with students, families, educators, community leaders and trusted local organisations. Local participation makes it easier to identify genuine needs and avoid unsuitable solutions.",
    "Some communities may require more classrooms, while others need trained teachers, scholarships, transportation, learning materials, student accommodation or access to technology. In certain areas, economic pressure may prevent children from attending school even when a school building is available.",
    "Listening must come before action. A successful programme is not simply one that delivers resources; it is one that provides the right support in a responsible and sustainable way.",
    "## Girls and vulnerable children must not be left behind",
    "The children who could benefit most from education are often the ones who face the greatest barriers to accessing it. Poverty, disability, displacement, discrimination, insecurity and household responsibilities can all interrupt a child’s education.",
    "Girls may face additional challenges in some communities, including safety concerns, limited facilities, social expectations or a lack of family resources. Addressing these barriers requires cooperation and sensitivity.",
    "Every child deserves the opportunity to learn in safety and dignity. Inclusive education programmes should consider accessibility, protection, cultural context and the particular needs of vulnerable students.",
    "## A shared responsibility",
    "Governments carry the primary responsibility for providing education, but they cannot always meet every need alone—especially in areas affected by conflict, disaster, displacement or economic hardship.",
    "Civil society organisations, educators, volunteers, donors, universities, businesses and local communities can all contribute. Their support might fund scholarships, provide learning materials, train teachers, mentor students, improve facilities or help young people navigate higher education.",
    "Even a small contribution can become meaningful when it is part of a well-planned and transparent programme.",
    "## Building stronger futures",
    "Humanitarian work begins with recognising the dignity of every person. It means responding to suffering, but it also means recognising people’s abilities, ambitions and potential.",
    "Education reflects this principle especially well. It does not treat people only as recipients of assistance. It gives them tools they can use to shape their own lives, support others and participate in building stronger communities.",
    "Meeting an urgent need can protect someone today. Creating access to education can help that person build tomorrow. That is why education is not separate from humanitarian action—it is one of its most hopeful and enduring forms.",
  ],
};

const turkish = {
  locale: "tr" as const,
  title: "Eğitim Neden İnsani Desteğin En Güçlü Biçimlerinden Biridir?",
  excerpt:
    "Acil yardım insanları bugün korur. Eğitim ise daha güvenli bir yarın kurmaları için bilgi, özgüven ve fırsat sunar.",
  imageAlt: "Destekleyici bir sınıf ortamında birlikte öğrenen öğrenciler",
  body: [
    "İnsani yardım denildiğinde çoğu insanın aklına gıda kolileri, temiz su, ilaç, barınma ve acil ihtiyaç malzemeleri gelir. Bu destekler hayati önem taşır. Savaş, göç, doğal afet veya ağır yoksulluk dönemlerinde temel ihtiyaçların karşılanması hayatları koruyabilir ve insanlara yeniden güven duygusu kazandırabilir.",
    "Ancak insani sorumluluk, acil kriz sona erdiğinde bitmez. Toplumların toparlanmak, hayatlarını yeniden kurmak ve geleceğe hazırlanmak için fırsatlara da ihtiyacı vardır. Eğitim, tam da bu noktada insani desteğin en güçlü ve kalıcı biçimlerinden biri hâline gelir.",
    "## Eğitim fırsatlar oluşturur",
    "Eğitim, çocuklar ve gençler için yoksulluk ve göçün kapalı tuttuğu kapıları açabilir. Okuryazarlığı, bilgiyi, özgüveni, iletişimi ve problem çözme becerilerini geliştirir. Bu beceriler öğrencilerin bilinçli kararlar almasına ve içinde yaşadıkları topluma daha etkin katılmasına yardımcı olur.",
    "Nitelikli eğitim alan bir çocuk yalnızca akademik bilgi kazanmaz. Eğitim, ona farklı bir gelecek hayal etme cesareti ve bu geleceğin peşinden gidebilme imkânı verir.",
    "Eğitimin faydası tek bir kişiyle sınırlı değildir. Eğitimli bir birey ailesini destekleyebilir, yerel ekonomiye katkıda bulunabilir, bilgisini başkalarıyla paylaşabilir ve bütün bir toplumun güçlenmesine yardımcı olabilir. Bu nedenle eğitime yapılan yatırım nesiller boyunca fayda üretmeye devam edebilir.",
    "## Büyümek için güvenli bir alan",
    "Okullar ve eğitim merkezleri belirsizlik dönemlerinde istikrar sağlayabilir. Çatışma, afet, yoksulluk veya göçten etkilenen çocuklar için düzenli bir öğrenme ortamı, günlük rutini ve normallik duygusunu yeniden kurabilir.",
    "Destekleyici bir eğitim ortamı aynı zamanda koruma sağlayabilir. Öğretmenler ve toplum çalışanları, bir çocuğun ihmal, istismar, duygusal sıkıntı veya başka risklerle karşı karşıya olduğunu fark edebilir. Sorumlu biçimde tasarlanan eğitim programları, savunmasız çocukları ve aileleri uygun destek mekanizmalarıyla buluşturabilir.",
    "Bu nedenle eğitim, yalnızca sınıfta verilen derslerden ibaret görülmemelidir. Çocukların sosyal, duygusal, ahlaki ve zihinsel yönden gelişebileceği güvenli ve saygılı bir alan sunmalıdır.",
    "## Toplumların daha bağımsız olmasına yardımcı olmak",
    "Acil yardım insanların bugünkü ihtiyaçlarına cevap verir. Eğitim ise onları yarına hazırlar.",
    "Burslar, mesleki eğitimler, üniversite rehberliği, dil eğitimi ve uygulamalı beceri programları insanların daha bağımsız hâle gelmesine yardımcı olabilir. Gençlerin iş bulmasını, ailelerini desteklemesini, iş kurmasını veya toplumlarına hizmet etmesini sağlayabilir.",
    "Bu, acil yardımın daha az önemli olduğu anlamına gelmez. Gıda, barınma, sağlık hizmeti ve koruma, acil ihtiyacın bulunduğu her yerde vazgeçilmezdir. En güçlü insani yaklaşım, acil desteği uzun vadeli kalkınmayla bir araya getirir.",
    "Bir gıda kolisi bir ailenin zor bir dönemi atlatmasına yardımcı olabilir. Eğitim ve beceri geliştirme desteği ise aynı ailenin gelecek yıllarda daha istikrarlı bir hayat kurmasına katkı sağlayabilir. Her iki destek türü de değerlidir; fakat iyileşmenin farklı aşamalarına hizmet eder.",
    "## Eğitim yerel gerçeklikleri yansıtmalıdır",
    "Etkili eğitim programları, hizmet edeceği insanlar anlaşılmadan uzaktan tasarlanamaz. Her toplumun kendine özgü dili, kültürü, değerleri, ekonomik koşulları ve eğitim ihtiyaçları vardır.",
    "Bu nedenle programlar öğrenciler, aileler, eğitimciler, toplum liderleri ve güvenilir yerel kuruluşlarla istişare içinde geliştirilmelidir. Yerel katılım, gerçek ihtiyaçların belirlenmesini ve uygun olmayan çözümlerden kaçınılmasını kolaylaştırır.",
    "Bazı toplumların daha fazla sınıfa ihtiyacı olabilirken bazılarının eğitimli öğretmenlere, burslara, ulaşıma, öğrenme materyallerine, öğrenci yurtlarına veya teknolojiye erişime ihtiyacı olabilir. Bazı bölgelerde okul binası mevcut olsa bile ekonomik baskılar çocukların okula devam etmesini engelleyebilir.",
    "Eylemden önce dinlemek gerekir. Başarılı bir program yalnızca kaynak ulaştıran değil, doğru desteği sorumlu ve sürdürülebilir bir biçimde sunan programdır.",
    "## Kız çocukları ve savunmasız çocuklar geride bırakılmamalıdır",
    "Eğitimden en fazla fayda sağlayabilecek çocuklar, çoğu zaman eğitime erişimde en büyük engellerle karşılaşanlardır. Yoksulluk, engellilik, göç, ayrımcılık, güvensizlik ve ev içi sorumluluklar bir çocuğun eğitimini kesintiye uğratabilir.",
    "Kız çocukları bazı toplumlarda güvenlik kaygıları, yetersiz tesisler, toplumsal beklentiler veya aile kaynaklarının sınırlı olması gibi ek güçlüklerle karşılaşabilir. Bu engellerin aşılması iş birliği ve hassasiyet gerektirir.",
    "Her çocuk güven ve onur içinde öğrenme fırsatına sahip olmalıdır. Kapsayıcı eğitim programları erişilebilirliği, korumayı, kültürel bağlamı ve savunmasız öğrencilerin özel ihtiyaçlarını dikkate almalıdır.",
    "## Ortak bir sorumluluk",
    "Eğitim sunma konusunda temel sorumluluk devletlere aittir. Ancak özellikle çatışma, afet, göç veya ekonomik güçlüklerden etkilenen bölgelerde devletler her ihtiyacı tek başına karşılayamayabilir.",
    "Sivil toplum kuruluşları, eğitimciler, gönüllüler, bağışçılar, üniversiteler, işletmeler ve yerel toplumların tamamı katkıda bulunabilir. Bu destek; burs sağlamak, öğrenme materyalleri temin etmek, öğretmenleri eğitmek, öğrencilere rehberlik etmek, tesisleri iyileştirmek veya gençlerin yükseköğrenim süreçlerini kolaylaştırmak şeklinde olabilir.",
    "Küçük bir katkı bile iyi planlanmış ve şeffaf bir programın parçası olduğunda anlamlı bir etkiye dönüşebilir.",
    "## Daha güçlü gelecekler inşa etmek",
    "İnsani çalışma, her insanın onurunu tanımakla başlar. Acıya karşılık vermenin yanında insanların yeteneklerini, hedeflerini ve potansiyellerini de görmeyi gerektirir.",
    "Eğitim bu ilkeyi güçlü biçimde yansıtır. İnsanları yalnızca yardım alan kişiler olarak görmez; onlara kendi hayatlarını şekillendirmek, başkalarını desteklemek ve daha güçlü toplumlar kurmak için kullanabilecekleri araçlar sunar.",
    "Acil bir ihtiyacın karşılanması bir insanı bugün koruyabilir. Eğitime erişim sağlanması ise onun yarını kurmasına yardımcı olabilir. Eğitim bu nedenle insani çalışmadan ayrı değildir; onun en umut verici ve kalıcı biçimlerinden biridir.",
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
