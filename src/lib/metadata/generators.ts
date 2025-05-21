// lib/metadata/generators.ts

import { Metadata } from "next";
import { getCurrentLanguage } from "@/actions/getCurrentLanguage";
import {
  seoTranslations,
  isSupportedLang,
  SupportedLang,
} from "./translations";

type PageContent = { title: string; description: string };
type PageKey = {
  [K in keyof (typeof seoTranslations)["th"]]: (typeof seoTranslations)["th"][K] extends PageContent
    ? K
    : never;
}[keyof (typeof seoTranslations)["th"]];

export async function generateLocalizedMetadata(
  pageKeyOrContent: PageKey | { title: string; description: string },
  overrides?: Partial<Metadata>
): Promise<Metadata> {
  const lang = await getCurrentLanguage();
  const locale: SupportedLang = isSupportedLang(lang) ? lang : "th";
  const t = seoTranslations[locale];

  const page =
    typeof pageKeyOrContent === "string"
      ? t[pageKeyOrContent]
      : pageKeyOrContent;

  return {
    metadataBase: new URL("https://fastwork.co"),
    applicationName: "Fastwork.co",
    title: page.title,
    description: page.description,
    openGraph: {
      title: page.title,
      description: page.description,
      url: overrides?.openGraph?.url ?? "https://fastwork.co",
      siteName: "Fastwork.co",
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
      ...overrides?.openGraph,
    },
    alternates: {
      canonical: overrides?.alternates?.canonical ?? "https://fastwork.co",
      languages: {
        th: `https://fastwork.co/th`,
        en: `https://fastwork.co/en`,
        vi: `https://fastwork.co/vi`,
      },
    },
    referrer: "strict-origin-when-cross-origin",
    ...overrides,
  };
}
