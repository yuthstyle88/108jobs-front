import JobDetail from "@/components/JobDetail";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { getCurrentLanguage } from "@/actions/getCurrentLanguage";
import { isSupportedLang } from "@/lib/metadata";

export async function generateMetadata() {
  const lang = await getCurrentLanguage();
  const locale = isSupportedLang(lang) ? lang : "th";

  const job = {
    title: {
      th: "เพิ่ม Traffic และ Backlink คุณภาพสูง ดัน Web ติดอันดับ SEO เร่ง index KW ให้ติดรัวๆ",
      en: "Boost Traffic & Quality Backlinks – Rank Top with SEO Experts",
      vi: "Tăng Traffic & Backlink chất lượng để đẩy web lên top Google",
    },
    description: {
      th: "หามืออาชีพรับทำ SEO ให้เว็บไซต์ติดหน้าแรกบน Google...",
      en: "Hire SEO professionals to rank your website top on Google...",
      vi: "Tìm chuyên gia SEO giúp website bạn lên top Google...",
    },
  };

  return generateLocalizedMetadata({
    title: job.title[locale],
    description: job.description[locale],
  });
}

export default function JobDetailPage() {
  return (
    <main className="pt-12 sm:pt-0">
      <JobDetail />
    </main>
  );
}
