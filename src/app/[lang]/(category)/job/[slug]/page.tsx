import CategoryDetail from "@/components/CategoryDetail";
import {generateLocalizedMetadata, isSupportedLang} from "@/lib/metadata";
import {getCurrentLanguage} from "@/actions/getCurrentLanguage";
import type {Metadata} from "next";
import {API_ROUTES} from "@/api/endpoints";
import {axiosPrivate} from "@/lib/axios";

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string}>;
}): Promise<Metadata> {
  const lang = await getCurrentLanguage();
  const {slug} = await params;
  const locale = isSupportedLang(lang) ? lang : "th";

  const defaultDescriptions: Record<string, string> = {
    th: "จ้างฟรีแลนซ์มืออาชีพสำหรับโปรเจกต์ของคุณที่ 108jobs ธุรกิจและสตาร์ทอัปชั้นนำไว้วางใจเรา",
    en: "Find professional freelancers for your project on 108jobs. Trusted by businesses and startups across Southeast Asia.",
    vi: "Tìm freelancer chuyên nghiệp cho dự án của bạn tại 108jobs. Được các doanh nghiệp và startup trên toàn Đông Nam Á tin tưởng.",
  };

  try {
    const res = await axiosPrivate.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.job.getCategoryBySlug}/${slug}`
    );

    if (!res.status) throw new Error("Failed to fetch category");

    const categoryList = await res.data.json();
    const raw = categoryList?.[0];

    const title = raw?.title || "108jobs";
    const description = defaultDescriptions[locale] || defaultDescriptions.th;

    return generateLocalizedMetadata({
      title: `${title} - 108jobs`,
      description,
    });
  } catch {
    return generateLocalizedMetadata({
      title: "108jobs - Freelance Marketplace",
      description: defaultDescriptions[locale] || defaultDescriptions.th,
    });
  }
}

export default async function SpecificCategory({
  params,
}: {
  params: Promise<{slug: string}>;
}) {
  const {slug} = await params;

  return (
    <main className="min-h-screen pt-10 sm:pt-0">
      <CategoryDetail slug={slug}/>
    </main>
  );
}
