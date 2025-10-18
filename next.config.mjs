/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        unoptimized: process.env.NODE_ENV === 'development',
        remotePatterns: [
            {protocol: 'https', hostname: 'staging.108jobs.com', pathname: '/api/v4/image/**'},
            {protocol: 'http', hostname: 'localhost', pathname: '/api/v4/image/**'},
            {protocol: 'http', hostname: 'localhost', pathname: '/api/v4/files/**'},
            {protocol: 'https', hostname: 'staging.108jobs.com', pathname: '/api/v4/image/**'},
            {protocol: 'https', hostname: 'fastwork.ibrowe.com', pathname: '/api/v4/image/**'},
            {protocol: 'https', hostname: 'api-fastwork-stg.ibrowe.com', pathname: '/api/v4/image/**'},
            {protocol: 'https', hostname: 'images.unsplash.com'},
            {protocol: 'https', hostname: '*.unsplash.com'},
            {protocol: 'https', hostname: 'storage.googleapis.com'},
            {protocol: 'https', hostname: '*.googleusercontent.com'},
            {protocol: 'https', hostname: 'fastlance.vn'},
        ],
        formats: ['image/webp', 'image/avif'],
        minimumCacheTTL: 31536000,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        dangerouslyAllowSVG: true,
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    },
    reactStrictMode: false,
    output: 'standalone',
    poweredByHeader: false,
    compress: true,
    eslint: {ignoreDuringBuilds: true},
    typescript: {ignoreBuildErrors: false},
    compiler: {
        removeConsole:
            process.env.NODE_ENV === 'production' && process.env.DEBUG !== 'true'
                ? {exclude: ['error', 'warn']}
                : false,
    },
    experimental: {
        optimizeCss: true,
        optimizePackageImports: ['@fortawesome/fontawesome-svg-core', '@fortawesome/free-solid-svg-icons'],
        serverActions: {bodySizeLimit: '2mb'},
        scrollRestoration: true,
        optimizeServerReact: true,
    },
    headers: async () => [
        {
            source: '/_next/image(.*)',
            headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}],
        },
        {
            source: '/_next/static/(.*)',
            headers: [{key: 'Cache-Control', value: 'public, max-age=31536000, immutable'}],
        },
    ],
    allowedDevOrigins: ['192.168.1.35', '192.168.1.*', 'my-proxy.local'],
    env: {COMMIT_HASH: process.env.COMMIT_HASH || 'default'},
    async rewrites() {
        const apiHost =
            process.env.NEXT_PUBLIC_USE_HTTPS === 'true'
                ? `https://${process.env.NEXT_PUBLIC_API_HOST_NAME}`
                : `http://${process.env.NEXT_PUBLIC_API_HOST_NAME}`;
        console.log(`Rewrites: API host set to ${process.env.NODE_ENV === 'development'}`);
        return [{source: '/api/:path*', destination: `${apiHost}/api/:path*`}];
    },
    webpack: (config) => {
        config.externals.push({sharp: 'commonjs sharp'});
        return config;
    },
};

console.log('next.config.mjs loaded with images.remotePatterns:', JSON.stringify(nextConfig.images.remotePatterns, null, 2));

export default nextConfig;