export function formatDateToLong(input?: string): string {
    if (!input) return "N/A";
    const date = new Date(input);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }
  