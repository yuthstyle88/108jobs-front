/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["upload.wikimedia.org", "images.unsplash.com"],
  },
};

export default nextConfig;

// const nextConfig = {
//   output: "export", 
//   images: {
//     unoptimized: true, 
//   },
// };
// export default nextConfig;