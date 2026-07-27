/**
 * Appends explanatory depth to the three published project bodies without
 * touching their facts, statuses or existing paragraphs. Idempotent: a project
 * whose body already ends with these paragraphs is left alone.
 */
import { and, eq } from "drizzle-orm";
import { db } from "../lib/db/client";
import { projects, projectTranslations } from "../lib/db/schema";

type Append = { en: string[]; tr: string[] };

const appends: Record<string, Append> = {
  "mazar-i-sharif-education-centre": {
    en: [
      "Many children in the region have experienced displacement or poverty that affects their access to meals, a safe place to sleep and basic health care. A comprehensive campus, rather than classrooms alone, is intended to hold those foundations inside the centre itself, so that a child whose circumstances at home are unstable can still learn in a secure and continuous environment.",
      "The preparation is designed to involve families, teachers and local authorities in decisions about the centre's design and its daily operation. Planning covers what a school needs in order to keep running — teaching staff, operating costs, maintenance and repair — rather than construction alone. The design is also intended to give girls and boys equal access to the centre's facilities and programmes, with particular attention to how daily operation will protect and sustain girls' participation.",
      "The campus is intended to serve the wider region as well as its own students. It is planned as a base from which education, skills development and social support can extend to women and girls in the surrounding area. Above all, it is being prepared so that the community regards the centre as its own institution, grounded in local priorities rather than in decisions taken elsewhere.",
    ],
    tr: [
      "Bölgedeki birçok çocuk; beslenmeye, güvenli bir barınma imkânına ve temel sağlık hizmetlerine erişimini etkileyen göç veya yoksulluk tecrübesi yaşamıştır. Yalnızca sınıflardan oluşan bir okul yerine bütüncül bir yerleşke planlanmasının amacı, bu temel ihtiyaçları merkezin kendi bünyesinde karşılamaktır; böylece ev şartları istikrarsız olan bir çocuk da güvenli ve kesintisiz bir ortamda öğrenmeye devam edebilir.",
      "Hazırlık süreci; merkezin tasarımına ve günlük işleyişine dair kararlarda ailelerin, öğretmenlerin ve yerel yetkililerin görüşünü içerecek şekilde kurgulanmıştır. Planlama yalnızca inşaatı değil, bir okulun ayakta kalabilmesi için gerekenleri de kapsar: öğretim kadrosu, işletme giderleri, bakım ve onarım. Tasarımda kız ve erkek öğrencilerin merkezin imkânlarına ve programlarına eşit erişimi hedeflenir; günlük işleyişin kız öğrencilerin katılımını koruyacak ve sürdürecek biçimde düzenlenmesine ayrıca önem verilir.",
      "Yerleşkenin yalnızca kendi öğrencilerine değil, çevre bölgeye de hizmet etmesi amaçlanmaktadır. Eğitimin, beceri geliştirmenin ve sosyal desteğin bölgedeki kadınlara ve kız çocuklarına ulaşabileceği bir merkez olarak planlanmaktadır. Her şeyden önce merkez; toplumun onu başka yerlerde alınmış kararların değil, kendi önceliklerinin ürünü olan bir kurum olarak görmesi gözetilerek hazırlanmaktadır.",
    ],
  },
  "pakistan-student-support": {
    en: [
      "Studying abroad involves more than the decision to go. A student needs to understand how a qualification will be recognised on return, work through unfamiliar application and enrolment procedures, choose a department that matches their own aims rather than accepting whatever place is available, and prepare for the practical reality of arriving in an unfamiliar city — language, accommodation, the cost of living and keeping in touch with family. Guidance is offered at each of these points rather than at the moment of application alone.",
      "The programme works with students rather than for them. That means honest advice, including telling a student when a plan looks unrealistic instead of confirming what they hope to hear; making no promise about admission, scholarships or accommodation that is not IHBA's to give; and treating a student's personal and family circumstances as confidential. Contact is not intended to end at enrolment, since the first year in a new country is usually when support is needed most.",
      "IHBA regards this work as a long-term educational and cultural bridge between Türkiye and Pakistan rather than a placement service. Students who complete their studies are well placed to guide those arriving after them, and the intention is that each group becomes part of the network supporting the next. Relationships built between students, universities and communities in this way outlast any single academic year.",
    ],
    tr: [
      "Yurt dışında okumak, gitme kararından çok daha fazlasını gerektirir. Öğrencinin; alacağı diplomanın dönüşte nasıl tanınacağını anlaması, alışık olmadığı başvuru ve kayıt işlemlerini yürütmesi, açık olan herhangi bir bölüme değil kendi hedeflerine uygun bir bölüme yönelmesi ve yeni bir şehre varmanın pratik gerçeğine hazırlanması gerekir: dil, barınma, yaşam maliyeti ve aileyle irtibatın sürdürülmesi. Rehberlik yalnızca başvuru anında değil, bu başlıkların her birinde sunulur.",
      "Program, öğrenciler adına değil öğrencilerle birlikte yürütülür. Bu; bir planın gerçekçi görünmediği durumlarda öğrencinin duymak istediğini onaylamak yerine bunu açıkça söylemek, derneğin elinde olmayan kabul, burs veya barınma konularında söz vermemek ve öğrencinin kişisel ve ailevî durumunu gizli tutmak anlamına gelir. İrtibatın kayıt işlemiyle sona ermemesi esastır; çünkü yeni bir ülkedeki ilk yıl, desteğe en çok ihtiyaç duyulan dönemdir.",
      "IHBA bu çalışmayı bir öğrenci yerleştirme hizmeti değil, Türkiye ile Pakistan arasında uzun vadeli bir eğitim ve kültür köprüsü olarak görür. Eğitimini tamamlayan öğrenciler, kendilerinden sonra gelenlere yol göstermek için en uygun konumdadır; amaç, her grubun bir sonrakini destekleyen ağın parçası hâline gelmesidir. Öğrenciler, üniversiteler ve topluluklar arasında bu yolla kurulan ilişkiler tek bir öğretim yılının ötesine geçer.",
    ],
  },
  "ramadan-qurban-programmes": {
    en: [
      "Households are identified through local knowledge and existing community relationships rather than by public registration or by whoever happens to arrive on the day. Field partners who live and work in an area know which families are in difficulty, what they already receive and who is likely to stay away — through caution, unfamiliarity with the process, or reluctance to be singled out in front of neighbours. Distribution is then arranged to be orderly and discreet: delivery to homes or through trusted community figures where that is more dignified than a queue, and coordination with other organisations working the same streets so that support is not duplicated while other households are missed.",
      "Where local conditions allow, food and livestock are bought in the area rather than brought in from outside. Buying locally supports the producers, butchers and traders who serve the community all year, avoids undercutting the market that families depend on, and shortens the distance between a donation and the household receiving it. Qurban is organised so that the requirements of the sacrifice are observed properly and the meat reaches those who need it while it is still in good condition, working with suppliers and butchers who understand those obligations.",
      "The season is treated as a beginning rather than a conclusion. What is recorded during Ramadan and Qurban work — which families were reached, in what circumstances, with which children and which longer-term needs — becomes the basis for following those households into education, health or livelihood support afterwards. IHBA is also open about the limit: seasonal assistance, however regular, cannot take the place of year-round programmes. Its value lies in identifying needs and building the relationships through which more sustained support can follow.",
    ],
    tr: [
      "Yardım ulaştırılacak haneler; ilan edilmiş bir kayıt sistemiyle veya o gün kim gelirse ona göre değil, yerel bilgi ve mevcut topluluk ilişkileri üzerinden belirlenir. Bölgede yaşayan ve çalışan saha ortakları hangi ailelerin güçlük içinde olduğunu, hâlihazırda hangi destekleri aldığını ve kimlerin geri durma ihtimalinin yüksek olduğunu bilir; bu geri durma çekingenlikten, süreci tanımamaktan veya komşularının önünde işaret edilmek istememekten kaynaklanır. Dağıtım da düzenli ve göze batmayacak biçimde kurgulanır: sıraya girmekten daha onurlu olduğu durumlarda yardım eve teslim edilir veya toplumun güvendiği kişiler aracılığıyla ulaştırılır; aynı mahallede çalışan diğer kuruluşlarla eşgüdüm sağlanarak bazı hanelere iki kez ulaşılırken diğerlerinin atlanması önlenir.",
      "Yerel şartlar imkân verdiğinde gıda ve kurbanlık hayvan, dışarıdan getirilmek yerine bölgeden temin edilir. Yerelden almak; topluluğa yıl boyunca hizmet eden üreticiyi, kasabı ve esnafı destekler, ailelerin geçimini bağladığı piyasayı zayıflatmaz ve bağış ile yardımı alan hane arasındaki mesafeyi kısaltır. Kurban organizasyonu; ibadetin gereklerinin usulüne uygun yerine getirilmesi ve etin bozulmadan ihtiyaç sahibine ulaşması gözetilerek, bu yükümlülükleri bilen tedarikçi ve kasaplarla yürütülür.",
      "Dönem, bir bitiş değil bir başlangıç olarak ele alınır. Ramazan ve Kurban çalışmaları sırasında kaydedilenler — hangi ailelere ulaşıldığı, hangi şartlarda, hangi çocuklarla ve hangi uzun vadeli ihtiyaçlarla — bu hanelerin sonrasında eğitim, sağlık veya geçim desteğiyle takip edilmesinin temelini oluşturur. IHBA sınırı da açıkça ifade eder: dönemsel yardım, ne kadar düzenli olursa olsun yıl boyu süren programların yerini alamaz. Değeri, ihtiyaçları tespit etmesinde ve daha kalıcı desteğin gelişebileceği ilişkileri kurmasındadır.",
    ],
  },
};

async function main() {
  for (const [slug, append] of Object.entries(appends)) {
    const project = await db.query.projects.findFirst({
      where: eq(projects.slug, slug),
      with: { projectTranslations: true },
    });
    if (!project) {
      console.log(`skipped ${slug}: not in the database`);
      continue;
    }

    for (const translation of project.projectTranslations) {
      const extra = append[translation.locale];
      if (!extra) continue;
      if (translation.body.includes(extra[0])) {
        console.log(`${slug} [${translation.locale}]: already expanded`);
        continue;
      }
      const body = [...translation.body, ...extra];
      await db
        .update(projectTranslations)
        .set({ body })
        .where(
          and(
            eq(projectTranslations.projectId, project.id),
            eq(projectTranslations.locale, translation.locale)
          )
        );
      console.log(
        `${slug} [${translation.locale}]: ${translation.body.length} → ${body.length} paragraphs`
      );
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
