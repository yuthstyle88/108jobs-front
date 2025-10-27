import type { NextConfig } from 'next';
import type { Configuration, RuleSetRule } from 'webpack';

const nextConfig: NextConfig = {
    // Produce a minimal, self-contained output for faster cold starts
    output: 'standalone',

    // Fail fast in production; allow flexibility in dev/CI if desired
    // Next.js 16: 'eslint' in next.config is no longer supported; manage ESLint via .eslintrc and CLI
    // Continue to ignore TypeScript build errors in non-prod to ease local dev/CI
    // Provide an explicit (empty) Turbopack config to avoid conflicts with custom webpack config
    turbopack: {},

    reactStrictMode: true,
    poweredByHeader: false,
    compress: true,

    // Reduce client bundle size and improve runtime perf

    // Prefer modern optimizations
    // Note: In Next.js 15, `optimizePackageImports` must be under `experimental`.
    experimental: {
        // Tree-shake and rewrite common libraries to per-module imports.
        optimizePackageImports: [
            'lodash',
            'date-fns',
            'lucide-react',
            'react-icons',
            '@radix-ui/react-accordion',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-collapsible',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slider',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
        ],
    },

    // Help Next.js tree-shake and dedupe by transpiling local packages if needed
    transpilePackages: ['lemmy-js-client'],

    images: {
        // Using Next/Image without on-the-fly optimization to keep server lean
        // Flip to `false` if you want Next's built-in Image Optimization.
        unoptimized: true,
    },

    // Smaller bundles and faster builds in production
    productionBrowserSourceMaps: false,

    // Security + cache headers
    // Ensure WebAssembly works reliably in all environments (avoid fetch failures)
    webpack: (config: Configuration, { isServer }: { isServer: boolean }) => {
        // Enable modern WebAssembly support in Webpack
        config.experiments = {
            ...config.experiments,
            asyncWebAssembly: true,
            topLevelAwait: true,
            layers: true,
        };

        // Some environments block or mis-serve .wasm via fetch(). To make the app resilient,
        // emit WASM as a real file so libraries that do `fetch(url)` can load it
        const rules = (config.module?.rules ?? []) as RuleSetRule[];
        const hasWasmRule = rules.some((r: RuleSetRule) => String(r.test) === String(/\.wasm$/));
        if (!hasWasmRule) {
            (config.module ??= { rules: [] as RuleSetRule[] }).rules!.push({
                test: /\.wasm$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/wasm/[name]-[hash][ext]',
                },
            });
        }

        return config;
    },

    async redirects() {
        // Redirect root to default locale to avoid 404 on '/'
        // NOTE: If you later implement middleware-based locale detection, you can remove this.
        const defaultLocale = 'th';

        // Redirect to /login when none of the auth cookies are present
        // Adjust the path list below to match the sections you want to protect
        return [
            {
                source: '/',
                destination: `/${defaultLocale}`,
                permanent: false,
            },
            {
                source: '/dashboard/:path*',
                destination: '/login',
                permanent: false,
                missing: [
                    {type: 'cookie', key: 'jwt'},
                    {type: 'cookie', key: 'access_token'},
                    {type: 'cookie', key: 'token'},
                    {type: 'header', key: 'authorization'},
                ],
            },
            {
                source: '/account/:path*',
                destination: '/login',
                permanent: false,
                missing: [
                    {type: 'cookie', key: 'jwt'},
                    {type: 'cookie', key: 'access_token'},
                    {type: 'cookie', key: 'token'},
                    {type: 'header', key: 'authorization'},
                ],
            },
            {
                source: '/settings/:path*',
                destination: '/login',
                permanent: false,
                missing: [
                    {type: 'cookie', key: 'jwt'},
                    {type: 'cookie', key: 'access_token'},
                    {type: 'cookie', key: 'token'},
                    {type: 'header', key: 'authorization'},
                ],
            },
        ];
    },

    // Rewrites to backend/CDN (replace env as needed)
    async rewrites() {
        const apiBase = process.env.API_INTERNAL_URL ?? 'https://api-staging.108jobs.com';
        return {
            // Ensure filesystem route `/api/session` wins before any proxying
            beforeFiles: [
                { source: '/session', destination: '/api/session' },
                { source: '/:lang(th|en|vi)/session', destination: '/api/session' },
                { source: '/api/session', destination: '/api/session' },
            ],
            // Proxy other API routes and static uploads
            afterFiles: [
                { source: '/api/:path((?!session$).*)', destination: `${apiBase}/:path*` },
                { source: '/uploads/:path*', destination: 'https://cdn.108jobs.com/uploads/:path*' },
            ],
            fallback: [],
        };
    },
};

export default nextConfig;