/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["upload.wikimedia.org", "images.unsplash.com"],
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