import type { Metadata } from "next";
import { getCurrentLanguage } from "@/actions/getCurrentLanguage";
import { seoTranslations, isSupportedLang, SupportedLang } from "./translations";

type PageContent = { title: string; description: string };
type PageKey = {
  [K in keyof (typeof seoTranslations)["th"]]: (typeof seoTranslations)["th"][K] extends PageContent
    ? K
    : never;
}[keyof (typeof seoTranslations)["th"]];

export async function generateLocalizedMetadata(
  pageKeyOrContent: PageKey | PageContent,
  options?: { lang?: string },
  overrides?: Partial<Metadata>
): Promise<Metadata> {
  const lang = options?.lang || (await getCurrentLanguage());
  const locale: SupportedLang = isSupportedLang(lang) ? lang : "th";
  const t = seoTranslations[locale];

  const page =
    typeof pageKeyOrContent === "string"
      ? t[pageKeyOrContent]
      : pageKeyOrContent;

  if (!page) {
    throw new Error(`Page content missing or invalid for key: ${pageKeyOrContent}`);
  }

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://fastwork.co";

  return {
    metadataBase: new URL(BASE_URL),
    applicationName: "Fastjob.co",
    title: page.title,
    description: page.description,
    openGraph: {
      ...overrides?.openGraph,
      title: page.title,
      description: page.description,
      url: overrides?.openGraph?.url ?? BASE_URL,
      siteName: "Fastjob.co",
      images: [
        {
          url: t.ogImage,
          width: 1200,
          height: 630,
          alt: page.title,
        },
      ],
      type: "website",
      locale: t.locale,
    },
    alternates: {
      canonical: overrides?.alternates?.canonical ?? BASE_URL,
      languages: {
        th: `${BASE_URL}/th`,
        en: `${BASE_URL}/en`,
        vi: `${BASE_URL}/vi`,
      },
    },
    referrer: "strict-origin-when-cross-origin",
    ...overrides,
  };
}