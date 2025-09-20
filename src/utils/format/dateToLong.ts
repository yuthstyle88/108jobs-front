export function formatDateToLong(input?: string, locale: string = "en-US"): string {
    console.log("Formatting date with locale:", locale);
    if (!input) return "N/A";
    const date = new Date(input);
    return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}