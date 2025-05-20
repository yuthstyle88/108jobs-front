import createMiddleware from 'next-intl/middleware';
import { routing } from './routing';

export default createMiddleware({
    locales: routing.locales,
    defaultLocale: routing.defaultLocale,
    localePrefix: 'always'
});

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/', '/(th|en|vi)/:path*']
};