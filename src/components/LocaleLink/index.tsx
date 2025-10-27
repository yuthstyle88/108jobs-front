"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { withLocalePrefix, normalizeLang } from "@/utils/localeHref";

function detectCurrentLangFromPath(path: string): string {
    const m = path.match(/^\/(\w{2})(\/|$)/);
    return m ? m[1] : "th";
}

type Props = Omit<React.ComponentProps<typeof Link>, "href"> & {
    href: string;
    lang?: string; // optional explicit lang override
};

export default function LocaleLink({ href, lang, ...rest }: Props) {
    const pathname = usePathname() ?? "/";
    const current = normalizeLang(lang ?? detectCurrentLangFromPath(pathname));
    const finalHref = withLocalePrefix(href, current);
    return <Link {...rest} href={finalHref} />;
}