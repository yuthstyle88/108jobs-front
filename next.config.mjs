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
      // HSTS (enable only behind HTTPS and once you are confident)
      // { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
      // Content Security Policy (start relaxed; harden later)
      // NOTE: Tune this for your domains/CDN; keep it simple for now.
      {
        key: 'Content-Security-Policy',
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: blob:",
          "font-src 'self' data:",
          "connect-src 'self'",
          "media-src 'self'",
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
    ];
  },
};

export default nextConfig;