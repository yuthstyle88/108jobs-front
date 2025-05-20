// lib/metadata/types.ts
export interface MetadataTranslation {
    websiteName: string
    defaultDescription: string
    ogDescription: string
    twitterDescription: string
    ogImageAlt: string
}

export interface MetadataTranslations {
    th: MetadataTranslation
    en: MetadataTranslation
    vi: MetadataTranslation
}