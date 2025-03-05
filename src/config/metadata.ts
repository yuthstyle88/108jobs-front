import { Metadata } from "next";

export const defaultMetadata:Metadata  = {
    metadataBase: new URL("https://fastwork.co"),
    title: "Fastwork.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
    description:
      "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
    applicationName: "Fastwork.co",
    openGraph: {
      title:
        "Fastwork.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
      description:
        "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
      url: "https://fastwork.co",
      siteName: "Fastwork.co",
      images: [
        {
          url: "https://fastwork.co/static-v4/images/home/og-image-home-th.jpg",
          width: 1200,
          height: 630,
          alt: "Fastwork.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
        },
      ],
      type: "website",
      locale: "th_TH",
    },
    alternates: {
      canonical: "https://fastwork.co",
      languages: {
        th: "https://fastwork.co",
        en: "https://fastwork.co",
        vi: "https://fastwork.co",
      },
    },
  
    referrer: "strict-origin-when-cross-origin",
  };