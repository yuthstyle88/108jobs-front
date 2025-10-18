/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        // Remove unoptimized: true to enable Next.js image optimization
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fastwork.ibrowe.com',
                pathname: '/api/v4/image/**',
            },
            {
                protocol: 'https',
                hostname: 'api-fastwork-stg.ibrowe.com',
                pathname: '/api/v4/image/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: '*.unsplash.com',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
            },
            {
                protocol: 'https',
                hostname: '*.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'fastlance.vn',
            },
            // Add any other domains you need
        ],
        formats: ['image/webp', 'image/avif'], // Reordered for better browser compatibility
        minimumCacheTTL: 31536000, // 1 year for static images
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        // Add these for better performance
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    reactStrictMode: false,
    output: "standalone",
    poweredByHeader: false,
    compress: true,
    // Add swc minification for better performance
    swcMinify: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false, // Set to true if you have TypeScript errors
    },
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production' && process.env.DEBUG !== 'true' ? {
            exclude: ['error', 'warn'],
        } : false,
    },
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons'], // Fixed typo
        serverActions: {
            bodySizeLimit: '2mb',
        },
        // Add these for better performance
        scrollRestoration: true,
        optimizeServerReact: true,
    },
    // Add caching headers for static assets
    headers: async () => {
        return [
            {
                source: '/_next/image(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
            {
                source: '/_next/static/(.*)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable',
                    },
                ],
            },
        ];
    },
    allowedDevOrigins: [
        '192.168.1.35',
        '192.168.1.*',
        'my-proxy.local',
    ],
    env: {
        COMMIT_HASH: process.env.COMMIT_HASH || "default",
    },
    async rewrites() {
        const apiHost = process.env.NEXT_PUBLIC_USE_HTTPS === "true"
            ? `https://${process.env.NEXT_PUBLIC_API_HOST_NAME}`
            : `http://${process.env.NEXT_PUBLIC_API_HOST_NAME}`;

        return [
            {
                source: "/api/:path*",
                destination: `${apiHost}/api/:path*`,
            },
        ];
    },
    // Add webpack configuration for better bundling
    webpack: (config, { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }) => {
        // Optimize sharp
        config.externals.push({
            'sharp': 'commonjs sharp'
        });

        return config;
    },
};

export default nextConfig;