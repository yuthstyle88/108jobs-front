import CategoryDetail from "@/components/CategoryDetail";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { getCurrentLanguage } from "@/actions/getCurrentLanguage";
import { isSupportedLang } from "@/lib/metadata";
import type { Metadata } from "next";
import { API_ROUTES } from "@/api/endpoints";
import { auth } from "@/auth";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const lang = await getCurrentLanguage();
  const { slug } = await params;
  const locale = isSupportedLang(lang) ? lang : "th";
  const session = await auth();

  const defaultDescriptions: Record<string, string> = {
    th: "จ้างฟรีแลนซ์มืออาชีพสำหรับโปรเจกต์ของคุณที่ Fastjob ธุรกิจและสตาร์ทอัปชั้นนำไว้วางใจเรา",
    en: "Find professional freelancers for your project on Fastjob. Trusted by businesses and startups across Southeast Asia.",
    vi: "Tìm freelancer chuyên nghiệp cho dự án của bạn tại Fastjob. Được các doanh nghiệp và startup trên toàn Đông Nam Á tin tưởng.",
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.job.get_category_by_slug}/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch category");

    const categoryList = await res.json();
    const raw = categoryList?.[0];

    const title = raw?.title || "Fastjob";
    const description = defaultDescriptions[locale] || defaultDescriptions.th;

    return generateLocalizedMetadata({
      title: `${title} - Fastjob`,
      description,
    });
  } catch {
    return generateLocalizedMetadata({
      title: "Fastjob - Freelance Marketplace",
      description: defaultDescriptions[locale] || defaultDescriptions.th,
    });
  }
}

export default async function SpecificCategory({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <main className="min-h-screen pt-10 sm:pt-0">
      <CategoryDetail slug={slug} />
    </main>
  );
}
