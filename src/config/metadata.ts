import { Metadata } from "next";

export const defaultMetadata:Metadata  = {
    metadataBase: new URL("https://fastwork.co"),
    title: "Fastjob.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
    description:
      "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
    applicationName: "Fastjob.co",
    openGraph: {
      title:
        "Fastjob.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
      description:
        "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
      url: "https://fastwork.co",
      siteName: "Fastjob.co",
      images: [
        {
          url: "https://fastwork.co/static-v4/images/home/og-image-home-th.jpg",
          width: 1200,
          height: 630,
          alt: "Fastjob.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
        },
      ],
      type: "website",
      locale: "th_TH",
    },
    alternates: {
      canonical: "https://test-fastwork.vercel.app",
      languages: {
        th: "https://test-fastwork.vercel.app/th",
        en: "https://test-fastwork.vercel.app/en",
        vi: "https://test-fastwork.vercel.app/vi",
      },
    },
  
    referrer: "strict-origin-when-cross-origin",
  };