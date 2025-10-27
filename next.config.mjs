/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  // Produce a minimal, self-contained output for faster cold starts
  output: 'standalone',

  // Fail fast in production; allow flexibility in dev/CI if desired
  // Always ignore ESLint during builds to prevent lint warnings/errors from failing CI builds
    // Fail fast in production; allow flexibility in dev/CI if desired
  // Always ignore ESLint during builds to avoid failing production builds due to lint issues
  eslint: { ignoreDuringBuilds: !isProd },
  typescript: { ignoreBuildErrors: !isProd },

  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Reduce client bundle size and improve runtime perf
  compiler: {
    // Only strip console.* in production bundles (except errors)
    removeConsole: isProd ? { exclude: ['error'] } : false,
  },

  // Prefer modern optimizations
  experimental: {
    // Tree-shake and rewrite common libraries to per-module imports
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
    // Better CSS handling in production
    optimizeCss: true,
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
  webpack: (config, { isServer }) => {
    // Enable modern WebAssembly support in Webpack
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
      layers: true,
    };

    // Some environments block or mis-serve .wasm via fetch(). To make the app resilient,
    // emit WASM as a real file so libraries that do `fetch(url)` can load it
    const hasWasmRule = config.module.rules.some(
      (r) => String(r.test) === String(/\.wasm$/)
    );
    if (!hasWasmRule) {
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/[name]-[hash][ext]',
        },
      });
    }

    return config;
  },

  async headers() {
    const securityHeaders = [
      // Protect against MIME sniffing
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      // Clickjacking protection (adjust if you embed your site in iframes)
      { key: 'X-Frame-Options', value: 'DENY' },
      // Basic XSS protection
      { key: 'X-XSS-Protection', value: '1; mode=block' },
      // Referrer policy
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      // Opt-in to modern security defaults (adjust per your features)
      { key: 'Permissions-Policy', value: 'geolocation=(), microphone=(), camera=(), interest-cohort=()' },
      // COOP and COEP for WASM isolation
      { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
      { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
      // HSTS (enable only behind HTTPS and once you are confident)
      // { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
      // Content Security Policy (start relaxed; harden later)
      // NOTE: Tune this for your domains/CDN; keep it simple for now.
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          // Allow WebAssembly and worker usage needed by some dependencies (e.g. syntax highlighters)
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' 'wasm-unsafe-eval' blob:",
          "worker-src 'self' blob:",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          // Allow fetching same-origin resources including WASM files served from /_next/static
          "connect-src 'self'",
          "media-src 'self'",
          // Forbid plugins completely
          "object-src 'none'",
          "frame-ancestors 'none'",
        ].join('; '),
      },
    ];

    return [
      // Apply security headers to all routes
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      // Cache Next static assets aggressively
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Cache public assets by extension
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|webp|avif|ico|woff|woff2|ttf|otf|eot|mp4|webm)',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Dedicated WASM headers for emitted WASM files
      {
        source: '/_next/static/wasm/:path*',
        headers: [
          { key: 'Content-Type', value: 'application/wasm' },
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
    ];
  },
};

export default nextConfig;