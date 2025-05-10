/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "upload.wikimedia.org",
      "images.unsplash.com",
      "azpet.com.vn",
      "fastwork.ibrowe.com",
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
};

export default nextConfig;


// const nextConfig = {
//   output: "export", 
//   images: {
//     unoptimized: true, 
//   },
// };
// export default nextConfig;