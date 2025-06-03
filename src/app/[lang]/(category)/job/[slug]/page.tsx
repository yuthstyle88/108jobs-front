import CategoryDetail from "@/components/CategoryDetail";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { getCurrentLanguage } from "@/actions/getCurrentLanguage";
import { isSupportedLang } from "@/lib/metadata";

export async function generateMetadata() {
  const lang = await getCurrentLanguage();
  const locale = isSupportedLang(lang) ? lang : "th";

  const category = {
    title: {
      th: "รับทำ SEO ให้ติดหน้าแรกบน Google - จ้างมืออาชีพได้ที่ Fastwork.co",
      en: "Hire SEO Experts to Rank on Google – Find the Right Freelancer at Fastwork",
      vi: "Thuê chuyên gia SEO đưa website lên top Google – Tìm freelancer phù hợp tại Fastwork",
    },
    description: {
      th: "หามืออาชีพรับทำ SEO ให้เว็บไซต์ติดหน้าแรกบน Google สร้างโอกาสทางการตลาด เพิ่มยอดขายให้ธุรกิจ การันตีคุณภาพ ที่ Fastwork.co แหล่งรวมผู้เชี่ยวชาญที่พร้อมช่วยคุณ",
      en: "Hire professionals to get your site on Google’s front page. Boost traffic, sales, and visibility with trusted freelancers at Fastwork.",
      vi: "Tìm chuyên gia giúp bạn SEO lên top Google. Tăng traffic, doanh thu và nhận sự hỗ trợ từ các freelancer chất lượng tại Fastwork.",
    },
  };

  return generateLocalizedMetadata({
    title: category.title[locale],
    description: category.description[locale],
  });
}

export default async function SpecificCategory({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

   return (
    <main className="min-h-screen pt-10 sm:pt-0">
      <CategoryDetail slug={resolvedParams.slug} />
    </main>
  );
}
