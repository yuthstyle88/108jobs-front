/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "upload.wikimedia.org",
      "images.unsplash.com",
      "azpet.com.vn",
      "fastwork.ibrowe.com",
      "cdn.shopify.com",
      "pottybuddy.co",
      "storage.googleapis.com",
      "fw-fileupload-vn-production.s3.ap-southeast-1.amazonaws.com",
      "fastlance.vn"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "fastwork.ibrowe.com",
        port: "",
        pathname: "/api/v4/image/**",
      },
      {
        protocol: "https",
        hostname: "example.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  reactStrictMode: true,
  output: "standalone",
  allowedDevOrigins: [
    '192.168.1.35',          // ไอพีเครื่องที่เปิดหน้าเว็บ
    '192.168.1.*',           // เผื่อวง LAN ย่อย
    'my-proxy.local',        // โดเมน dev reverse-proxy
  ],
  productionBrowserSourceMaps: false,
};

export default nextConfig;


// const nextConfig = {
//   output: "export",
//   images: {
//     unoptimized: true,
//   },
// };
// export default nextConfig;