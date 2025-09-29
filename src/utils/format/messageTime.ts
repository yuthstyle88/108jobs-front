export const toLocalTime = (input: string | number | Date, locale: string) => {
    const formatter = new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit' });
    const format = (d: Date) => formatter.format(d);

    // Guard
    if (input == null || input === '') return '';

    // Declare d here to ensure it's available in all scopes
    let d: Date;

    // Fast paths
    if (input instanceof Date && !isNaN(input.getTime())) return format(input);
    if (typeof input === 'number') {
        d = new Date(input);
        return isNaN(d.getTime()) ? '' : format(d);
    }

    let iso = String(input);

    // Normalize common variants:
    // 1) Space-separated: "YYYY-MM-DD HH:mm:ss(.sss)" → replace space with 'T'
    if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}(\.\d+)?$/.test(iso)) {
        iso = iso.replace(' ', 'T');
    }

    // 2) Missing timezone: add 'Z' (treat as UTC) if no Z/+/-
    if (!/[Zz+\-]$/.test(iso) && !/[Zz]|[+\-]\d{2}:?\d{2}$/.test(iso)) {
        iso = iso + 'Z';
    }

    // 3) Excess fractional seconds: clamp to 3 digits
    if (iso.includes('.')) {
        try {
            const [head, rest] = iso.split('.');
            let tz = '';
            let frac = rest;
            const tzMarkers = ['Z', 'z', '+', '-'] as const;
            let idx = -1;
            for (const m of tzMarkers) {
                const i = rest.indexOf(m);
                if (i > 0) { idx = i; break; }
            }
            if (idx >= 0) {
                tz = rest.slice(idx);
                frac = rest.slice(0, idx);
            }
            const frac3 = (frac + '000').slice(0, 3);
            iso = `${head}.${frac3}${tz || 'Z'}`;
        } catch {}
    }

    d = new Date(iso);
    return isNaN(d.getTime()) ? '' : format(d);
};