import {VALID_LANGUAGES} from "@/constants/language";

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
  guarantee: SEOPageContent;
  term: SEOPageContent;
  privacy: SEOPageContent;
  supportCenter: SEOPageContent;
  chat: SEOPageContent;
};

export const seoTranslations: Record<SupportedLang, LangSeoData> = {
  th: {
    locale: "thTh",
    ogImage: "https://fastwork.co/static-v4/images/home/og-image-home-th.jpg",
    home: {
      title:
        "Fastjob.co แหล่งรวมฟรีแลนซ์คุณภาพอันดับ 1 ที่ธุรกิจทั่วไทยเลือกใช้",
      description:
        "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
    },
    business: {
      title: "Fastjob for Business – แหล่งรวมฟรีแลนซ์สำหรับกลุ่มธุรกิจ",
      description: "Fastjob for Business – แหล่งรวมฟรีแลนซ์สำหรับกลุ่มธุรกิจ",
    },
    commission: {
      title: "ค่าคอมมิชชั่น | Fastjob",
      description: "รายละเอียดค่าคอมมิชชั่นของฟรีแลนซ์บน Fastjob",
    },
    startSelling: {
      title:
        "สมัครเป็นฟรีแลนซ์ อิสระของการทำงานที่คุณเลือกเองได้ | Fastjob.co",
      description:
        "ฟรีแลนซ์ฟาสต์เวิร์ค เพิ่มโอกาสถูกจ้างงานผ่านการค้นหาบน Google เข้าถึงโบนัสและสิทธิพิเศษมากมาย...",
    },
    profile: {
      title: "ประวัติโดยย่อ | Fastjob",
      description: "ดูข้อมูลโปรไฟล์พร้อมรายละเอียด",
    },
    coin: {
      title: "เหรียญของคุณ | Fastjob",
      description: "ตรวจสอบยอดเหรียญ ปรับยอด และดูประวัติการใช้เหรียญของคุณ",
    },
    jobBoard: {
      title: "หาฟรีแลนซ์ที่ตอบโจทย์ธุรกิจ",
      description:
        "บอร์ดประกาศงานสำหรับค้นหาฟรีแลนซ์ที่ใช่ รวมไปถึงฟรีแลนซ์ได้เลือกงานที่ชอบ ง่าย สะดวก ปลอดภัย ที่ Fastjob แพลตฟอร์มรวมผู้เชี่ยวชาญกว่า 100 หมวดหมู่เพื่อธุรกิจคุณ",
    },
    promotion: {
      title: "โปรโมชันและสิทธิพิเศษสำหรับผู้ใช้งานบน Fastjob.co",
      description:
        "รวบรวมโปรโมชัน คูปองส่วนลด (Coupon) และสิทธิพิเศษอีกมากมายสำหรับผู้ใช้งานบนแพลตฟอร์ม ที่ Fastjob.co แหล่งรวมฟรีแลนซ์ผู้เชี่ยวชาญ ที่พร้อมช่วยคุณ",
    },
    catalog: {
      title: "รวมบริการฟรีแลนซ์ทุกหมวดหมู่ | Fastjob",
      description:
        "เลือกบริการจากฟรีแลนซ์คุณภาพทุกหมวดหมู่ ไม่ว่าจะเป็นออกแบบ การตลาด เขียนโปรแกรม และอื่นๆ บนแพลตฟอร์ม Fastjob",
    },
    login: {
      title: "เข้าสู่ระบบ fastwork.co",
      description:
        "เข้าสู่ระบบเพื่อเริ่มต้นใช้งานแพลตฟอร์มฟรีแลนซ์อันดับ 1 ของไทย",
    },
    how: {
      title: "วิธีการซื้อ/ขายบน Fastjob?",
      description: "เว็บไซต์ตลาดฟรีแลนซ์อันดับหนึ่ง",
    },
    guarantee: {
      title:
        "การรับประกันโดย Fastjob | จ้างงานอย่างปลอดภัย พร้อมระบบคุ้มครองการชำระเงิน",
      description:
        "Fastjob รับประกันความพึงพอใจของคุณในการใช้บริการฟรีแลนซ์ เราดูแลให้เงินของคุณปลอดภัยตั้งแต่เริ่มต้นจนจบโครงการ",
    },
    term: {
      title: "เงื่อนไขการให้บริการ | Fastjob",
      description: "เงื่อนไขการให้บริการของ Fastjob",
    },
    privacy: {
      title: "นโยบายความเป็นส่วนตัว | Fastjob",
      description: "นโยบายความเป็นส่วนตัวของ Fastjob",
    },
    supportCenter: {
      title: "Fastjob - แพลตฟอร์มฟรีแลนซ์อันดับ 1 ในประเทศไทย",
      description:
        "แพลตฟอร์มตลาดฟรีแลนซ์อันดับหนึ่งในประเทศไทย จ้างฟรีแลนซ์มืออาชีพสำหรับทุกความต้องการทางธุรกิจของคุณ",
    },
    chat: {
      title: "Fastjob Chat",
      description:
        "คัดเฉพาะฟรีแลนซ์ผู้เชี่ยวชาญกว่า 5 หมื่นคน รับประกันได้งานตรงทุกความต้องการโดยทีมงานมืออาชีพ ที่ได้รับความไว้ใจจากลูกค้ากว่า 3 แสนราย ให้เราช่วยพัฒนาธุรกิจคุณ!",
    },
  },
  en: {
    locale: "enUs",
    ogImage: "https://fastwork.co/static-v4/images/home/og-image-home-en.jpg",
    home: {
      title: "Fastjob.co - Thailand’s #1 Freelance Platform",
      description:
        "Hire top freelancers in Thailand. Trusted by over 300,000 businesses. Get things done with quality and speed.",
    },
    business: {
      title: "Fastjob for Business – Freelancers for Enterprise",
      description: "Find top freelancers tailored for enterprise solutions.",
    },
    commission: {
      title: "Commission | Fastjob",
      description: "Details about Fastjob freelancer commission fees.",
    },
    startSelling: {
      title: "Become a Freelancer – Work the Way You Want | Fastjob",
      description:
        "Increase your visibility, get discovered on Google, and access exclusive freelancer bonuses with full support from the Fastjob team.",
    },
    profile: {
      title: "Profile | Fastjob",
      description: "View profile information with details",
    },
    coin: {
      title: "Your Coins | Fastjob",
      description: "Check your coin balance and transaction history.",
    },
    jobBoard: {
      title: "Find Freelancers That Fit Your Business",
      description:
        "A job board that helps businesses connect with the right freelancers. Post jobs or pick projects that suit you best — fast, safe, and smart with Fastjob.",
    },
    promotion: {
      title: "Promotions & Special Deals for Fastjob Users",
      description:
        "Explore coupons, discounts, and exclusive promotions available for Fastjob users. Hire top freelancers and enjoy special perks today.",
    },
    catalog: {
      title: "Explore All Freelance Services | Fastjob",
      description:
        "Browse quality freelance services across all categories – design, marketing, development and more, only on Fastjob.",
    },
    login: {
      title: "Authentication to fastwork.co",
      description:
        "Sign in to manage your projects, hire freelancers and grow your business on Fastjob.",
    },
    how: {
      title: "How to buy/sell on Fastjob?",
      description: "Number one, freelance market-place website.",
    },
    guarantee: {
      title: "Fastjob Guarantee | Safe Hiring with Payment Protection",
      description:
        "Fastjob guarantees your satisfaction with our freelance services. We ensure your funds are protected from project start to completion.",
    },
    term: {
      title: "Terms of Services | Fastjob",
      description: "Fastjob Terms of services",
    },
    privacy: {
      title: "Privacy Policy | Fastjob",
      description: "Fastjob Privacy Policy",
    },
    supportCenter: {
      title: "Fastjob - #1 Freelance Platform in Thailand",
      description:
        "The number one freelance marketplace platform in Thailand. Hire professional freelancers for all your business needs.",
    },
    chat: {
      title: "Fastjob Chat",
      description:
        "Hire top freelancers in Thailand. Trusted by over 300,000 businesses. Get things done with quality and speed.",
    },
  },
  vi: {
    locale: "viVn",
    ogImage: "https://fastwork.co/static-v4/images/home/og-image-home-vi.jpg",
    home: {
      title: "Fastjob.co - Nền tảng freelancer hàng đầu tại Thái Lan",
      description:
        "Tìm kiếm freelancer chất lượng cao, được tin dùng bởi hơn 300.000 doanh nghiệp. Hãy để chúng tôi giúp phát triển dự án của bạn!",
    },
    business: {
      title: "Fastjob for Business – Dành cho nhóm doanh nghiệp",
      description:
        "Tìm kiếm freelancer chuyên nghiệp cho doanh nghiệp của bạn.",
    },
    commission: {
      title: "Hoa hồng | Fastjob",
      description: "Chi tiết phí hoa hồng dành cho freelancer tại Fastjob.",
    },
    startSelling: {
      title: "Đăng ký freelancer – Tự do làm việc theo cách của bạn | Fastjob",
      description:
        "Tăng khả năng được tìm thấy, nhận ưu đãi độc quyền và có đội ngũ hỗ trợ từ Fastjob giúp bạn thành công.",
    },
    profile: {
      title: "Hồ sơ | Fastjob",
      description: "Xem thông tin hồ sơ với các chi tiết.",
    },
    coin: {
      title: "Xu của bạn | Fastjob",
      description: "Kiểm tra số dư xu và lịch sử giao dịch xu của bạn.",
    },
    jobBoard: {
      title: "Tìm freelancer phù hợp cho doanh nghiệp của bạn",
      description:
        "Bảng công việc giúp doanh nghiệp tìm đúng freelancer và giúp freelancer chọn công việc yêu thích. Nhanh chóng, tiện lợi, an toàn trên nền tảng Fastjob.",
    },
    promotion: {
      title: "Khuyến mãi & Ưu đãi đặc biệt cho người dùng Fastjob",
      description:
        "Tổng hợp mã giảm giá, coupon và nhiều ưu đãi hấp dẫn dành cho người dùng nền tảng Fastjob – nơi tập hợp freelancer chuyên nghiệp.",
    },
    catalog: {
      title: "Tất cả dịch vụ freelancer | Fastjob",
      description:
        "Khám phá các dịch vụ freelancer chất lượng trong mọi lĩnh vực: thiết kế, marketing, lập trình và nhiều hơn nữa tại Fastjob.",
    },
    login: {
      title: "Đăng nhập fastwork.co",
      description:
        "Đăng nhập để quản lý dự án và thuê freelancer chất lượng trên nền tảng Fastjob.",
    },
    how: {
      title: "Cách mua/bán trên Fastjob?",
      description: "Trang web thị trường freelance số một.",
    },
    guarantee: {
      title: "Đảm bảo từ Fastjob | Thuê an toàn với bảo vệ thanh toán",
      description:
        "Fastjob cam kết sự hài lòng của bạn với các dịch vụ freelance. Chúng tôi đảm bảo số tiền của bạn được bảo vệ từ lúc bắt đầu đến khi hoàn thành dự án.",
    },
    term: {
      title: "Điều khoản dịch vụ | Fastjob",
      description: "Điều khoản dịch vụ của Fastjob",
    },
    privacy: {
      title: "Chính sách quyền riêng tư | Fastjob",
      description: "Chính sách quyền riêng tư của Fastjob",
    },
    supportCenter: {
      title: "Fastjob - Nền tảng freelance số 1 tại Thái Lan",
      description:
        "Nền tảng marketplace freelance hàng đầu tại Thái Lan. Thuê freelancer chuyên nghiệp cho mọi nhu cầu kinh doanh của bạn.",
    },
    chat: {
      title: "Fastjob Chat",
      description:
        "Tìm kiếm freelancer chất lượng cao, được tin dùng bởi hơn 300.000 doanh nghiệp. Hãy để chúng tôi giúp phát triển dự án của bạn!",
    },
  },
};

export function isSupportedLang(lang: unknown): lang is SupportedLang {
  return typeof lang === "string" && VALID_LANGUAGES.includes(lang);
}
