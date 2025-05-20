// lib/metadata/generators.ts
import { Metadata } from 'next'
import { metadataTranslations } from './translations'
import { siteConfig } from './config'

type GenerateMetadataProps = {
    locale: string
    path?: string
}

export function generateBaseMetadata({ locale, path = '' }: GenerateMetadataProps): Metadata {
    const t = metadataTranslations[locale as keyof typeof metadataTranslations]

    return {
        metadataBase: new URL(siteConfig.metadataBase),
        title: {
            template: `%s | ${t.websiteName}`,
            default: t.websiteName,
        },
        description: t.defaultDescription,
        alternates: {
            canonical: path,
            languages: {
                th: `/th${path}`,
                en: `/en${path}`,
                vi: `/vi${path}`
            }
        },
        openGraph: {
            title: t.websiteName,
            description: t.ogDescription,
            url: `${siteConfig.metadataBase}${path}`,
            siteName: t.websiteName,
            images: [
                {
                    url: siteConfig.defaultOgImage,
                    width: 1200,
                    height: 630,
                    alt: t.ogImageAlt,
                }
            ],
            locale: locale,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: t.websiteName,
            description: t.twitterDescription,
            images: [siteConfig.defaultTwitterImage],
            creator: siteConfig.twitterHandle,
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        verification: {
            google: siteConfig.googleVerificationCode,
        }
    }
}