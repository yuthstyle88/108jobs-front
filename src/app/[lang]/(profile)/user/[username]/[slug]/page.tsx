import JobDetail from "@/components/JobDetail";
import { generateLocalizedMetadata } from "@/lib/metadata";
import { getCurrentLanguage } from "@/actions/getCurrentLanguage";
import { isSupportedLang } from "@/lib/metadata";
import { Metadata } from "next";
import { auth } from "@/auth";
import { API_ROUTES } from "@/api/endpoints";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; username: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;
  const lang = await getCurrentLanguage();
  const locale = isSupportedLang(lang) ? lang : "th";
  const session = await auth();

  const defaultDescriptions: Record<string, string> = {
    th: "จ้างฟรีแลนซ์มืออาชีพสำหรับโปรเจกต์ของคุณที่ Fastwork ธุรกิจและสตาร์ทอัปชั้นนำไว้วางใจเรา",
    en: "Find professional freelancers for your project on Fastwork. Trusted by businesses and startups across Southeast Asia.",
    vi: "Tìm freelancer chuyên nghiệp cho dự án của bạn tại Fastwork. Được các doanh nghiệp và startup trên toàn Đông Nam Á tin tưởng.",
  };

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.job.get_job_detail_by_id}/${username}/${slug}`,
      {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch job detail");
    }

    const jobDetail = await res.json();
    const title = jobDetail?.title || "Fastwork";
    const description = defaultDescriptions[locale] || defaultDescriptions.th;

    return generateLocalizedMetadata({
      title: `${title} - Fastwork`,
      description,
    });
  } catch {
    return generateLocalizedMetadata({
      title: "Fastwork - Hire Freelancers for Any Job",
      description: defaultDescriptions[locale] || defaultDescriptions.th,
    });
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string; username: string }>;
}) {
  const { username, slug } = await params;

  return (
    <main className="sm:pt-0">
      <JobDetail username={username} slug={slug} />
    </main>
  );
}
