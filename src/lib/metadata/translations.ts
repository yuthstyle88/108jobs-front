// lib/metadata/translations.ts
import type { MetadataTranslations } from './types'

export const metadataTranslations: MetadataTranslations = {
    th: {
        websiteName: 'ชื่อเว็บไซต์',
        defaultDescription: 'คำอธิบายเว็บไซต์ภาษาไทย',
        ogDescription: 'คำอธิบาย OpenGraph ภาษาไทย',
        twitterDescription: 'คำอธิบาย Twitter ภาษาไทย',
        ogImageAlt: 'รูป OpenGraph ภาษาไทย'
    },
    en: {
        websiteName: 'Website Name',
        defaultDescription: 'Website description in English',
        ogDescription: 'OpenGraph description in English',
        twitterDescription: 'Twitter description in English',
        ogImageAlt: 'OpenGraph image in English'
    },
    vi: {
        websiteName: 'Tên trang web',
        defaultDescription: 'Mô tả trang web',
        ogDescription: 'Mô tả OpenGraph',
        twitterDescription: 'Mô tả Twitter',
        ogImageAlt: 'Hình ảnh OpenGraph'
    }
}