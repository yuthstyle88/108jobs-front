/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    eslint: { ignoreDuringBuilds: true },
    typescript: { ignoreBuildErrors: true },
    images: {
        formats: ["image/avif", "image/webp"],
        minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
        // Allow serving local SVGs via next/image (not optimized) safely
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
        deviceSizes: [320, 420, 768, 1024, 1280, 1536, 1920],
        imageSizes: [16, 24, 32, 48, 64, 96, 128, 256, 384],
    },
}
export default nextConfig;