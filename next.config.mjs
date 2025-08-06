/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { protocol: 'http', hostname: 'images.example.com', pathname: '/**' },
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
            {
                protocol: 'https',
                hostname: 'api-fastwork-stg.ibrowe.com',
                pathname: '/api/v4/image/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 60,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    reactStrictMode: true,
    output: "standalone",
    poweredByHeader: false,
    compress: true,
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' ? {
            exclude: ['error', 'warn'],
        } : false,
    },
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons'],
        serverActions: {
            bodySizeLimit: '2mb',
        },

    },
    allowedDevOrigins: [
        '192.168.1.35',          // ไอพีเครื่องที่เปิดหน้าเว็บ
        '192.168.1.*',           // เผื่อวง LAN ย่อย
        'my-proxy.local',        // โดเมน dev reverse-proxy
    ],
    env: {
        COMMIT_HASH: process.env.COMMIT_HASH || "default", // ใช้ค่า Default หาก COMMIT_HASH เป็น undefined
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