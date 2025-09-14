import JobDetail from "@/components/JobDetail";
import {generateLocalizedMetadata, isSupportedLang} from "@/lib/metadata";
import {getCurrentLanguage} from "@/actions/getCurrentLanguage";
import {Metadata} from "next";
// import { auth } from "@/auth";
import {API_ROUTES} from "@/api/endpoints";
import {axiosPrivate} from "@/lib/axios";
import {getAppName} from "@/utils/appConfig";

export async function generateMetadata({
  params,
}: {
  params: Promise<{slug: string; username: string}>;
}): Promise<Metadata> {
  const {username, slug} = await params;
  const locale =  await getCurrentLanguage();
  const appName = getAppName();
  const defaultDescriptions: Record<string, string> = {
    th: `จ้างฟรีแลนซ์มืออาชีพสำหรับโปรเจกต์ของคุณที่ ${appName} ธุรกิจและสตาร์ทอัปชั้นนำไว้วางใจเรา`,
    en: `Find professional freelancers for your project on ${appName}. Trusted by businesses and startups across Southeast Asia.`,
    vi: `Tìm freelancer chuyên nghiệp cho dự án của bạn tại ${appName}. Được các doanh nghiệp và startup trên toàn Đông Nam Á tin tưởng.`,
  };

  try {
    const res = await axiosPrivate.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}${API_ROUTES.job.getJobDetailById}/${username}/${slug}`
    );

    if (!res.status) {
      throw new Error("Failed to fetch job detail");
    }

    const jobDetail = await res.data.json();
    const title = jobDetail?.title || appName;
    const description = defaultDescriptions[locale] || defaultDescriptions.th;

    return generateLocalizedMetadata({
      title: `${title} - ${appName}`,
      description,
    });
  } catch {
    return generateLocalizedMetadata({
      title: `${appName} - Hire Freelancers for Any Job`,
      description: defaultDescriptions[locale] || defaultDescriptions.th,
    });
  }
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{slug: string; username: string}>;
}) {
  const {username, slug} = await params;

  return (
    <main className="sm:pt-0">
      <JobDetail username={username} slug={slug}/>
    </main>
  );
}
