export type SupportedLang = "th" | "en" | "vi";

type SEOPageContent = {
  title: string;
  description: string;
};

type LangSeoData = {
  locale: string;
  ogImage: string;
  home: SEOPageContent;
  business: SEOPageContent;
  commission: SEOPageContent;
  startSelling: SEOPageContent;
  profile: SEOPageContent;
  coin: SEOPageContent;
  jobBoard: SEOPageContent;
  promotion: SEOPageContent;
  catalog: SEOPageContent;
  login: SEOPageContent;
  how: SEOPageContent;
};

export const seoTranslations: Record<SupportedLang, LangSeoData> = {
  th: {
    locale: "th_TH",
    ogImage: "https://fastwork.co/static-v4/images/home/og-image-home-th.jpg",
    home: {
      title:
        "Fastwork.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
      description:
        "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
    },
    business: {
      title: "Fastwork for Business – แหล่งรวมฟรีแลนซ์สำหรับกลุ่มธุรกิจ",
      description: "Fastwork for Business – แหล่งรวมฟรีแลนซ์สำหรับกลุ่มธุรกิจ",
    },
    commission: {
      title: "ค่าคอมมิชชั่น | Fastwork",
      description: "รายละเอียดค่าคอมมิชชั่นของฟรีแลนซ์บน Fastwork",
    },
    startSelling: {
      title:
        "สมัครเป็นฟรีแลนซ์ อิสระของการทำงานที่คุณเลือกเองได้ | Fastwork.co",
      description:
        "ฟรีแลนซ์ฟาสต์เวิร์ค เพิ่มโอกาสถูกจ้างงานผ่านการค้นหาบน Google เข้าถึงโบนัสและสิทธิพิเศษมากมาย...",
    },
    profile: {
      title: "ประวัติโดยย่อ | Fastwork",
      description: "ดูข้อมูลโปรไฟล์พร้อมรายละเอียด",
    },
    coin: {
      title: "เหรียญของคุณ | Fastwork",
      description: "ตรวจสอบยอดเหรียญ ปรับยอด และดูประวัติการใช้เหรียญของคุณ",
    },
    jobBoard: {
      title: "หาฟรีแลนซ์ที่ตอบโจทย์ธุรกิจ",
      description:
        "บอร์ดประกาศงานสำหรับค้นหาฟรีแลนซ์ที่ใช่ รวมไปถึงฟรีแลนซ์ได้เลือกงานที่ชอบ ง่าย สะดวก ปลอดภัย ที่ Fastwork แพลตฟอร์มรวมผู้เชี่ยวชาญกว่า 100 หมวดหมู่เพื่อธุรกิจคุณ",
    },
    promotion: {
      title: "โปรโมชันและสิทธิพิเศษสำหรับผู้ใช้งานบน Fastwork.co",
      description:
        "รวบรวมโปรโมชัน คูปองส่วนลด (Coupon) และสิทธิพิเศษอีกมากมายสำหรับผู้ใช้งานบนแพลตฟอร์ม ที่ Fastwork.co แหล่งรวมฟรีแลนซ์ผู้เชี่ยวชาญ ที่พร้อมช่วยคุณ",
    },
    catalog: {
      title: "รวมบริการฟรีแลนซ์ทุกหมวดหมู่ | Fastwork",
      description:
        "เลือกบริการจากฟรีแลนซ์คุณภาพทุกหมวดหมู่ ไม่ว่าจะเป็นออกแบบ การตลาด เขียนโปรแกรม และอื่นๆ บนแพลตฟอร์ม Fastwork",
    },
    login: {
      title: "เข้าสู่ระบบ fastwork.co",
      description:
        "เข้าสู่ระบบเพื่อเริ่มต้นใช้งานแพลตฟอร์มฟรีแลนซ์อันดับ 1 ของไทย",
    },
    how: {
      title: "วิธีการซื้อ/ขายบน Fastwork?",
      description: "เว็บไซต์ตลาดฟรีแลนซ์อันดับหนึ่ง",
    },
  },
  en: {
    locale: "en_US",
    ogImage: "https://fastwork.co/static-v4/images/home/og-image-home-en.jpg",
    home: {
      title: "Fastwork.co - Thailand’s #1 Freelance Platform",
      description:
        "Hire top freelancers in Thailand. Trusted by over 300,000 businesses. Get things done with quality and speed.",
    },
    business: {
      title: "Fastwork for Business – Freelancers for Enterprise",
      description: "Find top freelancers tailored for enterprise solutions.",
    },
    commission: {
      title: "Commission | Fastwork",
      description: "Details about Fastwork freelancer commission fees.",
    },
    startSelling: {
      title: "Become a Freelancer – Work the Way You Want | Fastwork",
      description:
        "Increase your visibility, get discovered on Google, and access exclusive freelancer bonuses with full support from the Fastwork team.",
    },
    profile: {
      title: "Profile | Fastwork",
      description: "View profile information with details",
    },
    coin: {
      title: "Your Coins | Fastwork",
      description: "Check your coin balance and transaction history.",
    },
    jobBoard: {
      title: "Find Freelancers That Fit Your Business",
      description:
        "A job board that helps businesses connect with the right freelancers. Post jobs or pick projects that suit you best — fast, safe, and smart with Fastwork.",
    },
    promotion: {
      title: "Promotions & Special Deals for Fastwork Users",
      description:
        "Explore coupons, discounts, and exclusive promotions available for Fastwork users. Hire top freelancers and enjoy special perks today.",
    },
    catalog: {
      title: "Explore All Freelance Services | Fastwork",
      description:
        "Browse quality freelance services across all categories – design, marketing, development and more, only on Fastwork.",
    },
    login: {
      title: "Login to fastwork.co",
      description:
        "Sign in to manage your projects, hire freelancers and grow your business on Fastwork.",
    },
    how: {
      title: "How to buy/sell on Fastwork?",
      description: "Number one, freelance market-place website.",
    },
  },
  vi: {
    locale: "vi_VN",
    ogImage: "https://fastwork.co/static-v4/images/home/og-image-home-vi.jpg",
    home: {
      title: "Fastwork.co - Nền tảng freelancer hàng đầu tại Thái Lan",
      description:
        "Tìm kiếm freelancer chất lượng cao, được tin dùng bởi hơn 300.000 doanh nghiệp. Hãy để chúng tôi giúp phát triển dự án của bạn!",
    },
    business: {
      title: "Fastwork for Business – Dành cho nhóm doanh nghiệp",
      description:
        "Tìm kiếm freelancer chuyên nghiệp cho doanh nghiệp của bạn.",
    },
    commission: {
      title: "Hoa hồng | Fastwork",
      description: "Chi tiết phí hoa hồng dành cho freelancer tại Fastwork.",
    },
    startSelling: {
      title: "Đăng ký freelancer – Tự do làm việc theo cách của bạn | Fastwork",
      description:
        "Tăng khả năng được tìm thấy, nhận ưu đãi độc quyền và có đội ngũ hỗ trợ từ Fastwork giúp bạn thành công.",
    },
    profile: {
      title: "Hồ sơ | Fastwork",
      description: "Xem thông tin hồ sơ với các chi tiết.",
    },
    coin: {
      title: "Xu của bạn | Fastwork",
      description: "Kiểm tra số dư xu và lịch sử giao dịch xu của bạn.",
    },
    jobBoard: {
      title: "Tìm freelancer phù hợp cho doanh nghiệp của bạn",
      description:
        "Bảng công việc giúp doanh nghiệp tìm đúng freelancer và giúp freelancer chọn công việc yêu thích. Nhanh chóng, tiện lợi, an toàn trên nền tảng Fastwork.",
    },
    promotion: {
      title: "Khuyến mãi & Ưu đãi đặc biệt cho người dùng Fastwork",
      description:
        "Tổng hợp mã giảm giá, coupon và nhiều ưu đãi hấp dẫn dành cho người dùng nền tảng Fastwork – nơi tập hợp freelancer chuyên nghiệp.",
    },
    catalog: {
      title: "Tất cả dịch vụ freelancer | Fastwork",
      description:
        "Khám phá các dịch vụ freelancer chất lượng trong mọi lĩnh vực: thiết kế, marketing, lập trình và nhiều hơn nữa tại Fastwork.",
    },
    login: {
      title: "Đăng nhập fastwork.co",
      description:
        "Đăng nhập để quản lý dự án và thuê freelancer chất lượng trên nền tảng Fastwork.",
    },
    how: {
      title: "Cách mua/bán trên Fastwork?",
      description: "Trang web thị trường freelance số một.",
    },
  },
};

export function isSupportedLang(lang: unknown): lang is SupportedLang {
  return typeof lang === "string" && ["th", "en", "vi"].includes(lang);
}
