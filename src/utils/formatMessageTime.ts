export function formatMessageTime(dateString: string, locale: string): string {
  const date = new Date(dateString);
  const now = new Date();

  const isSameDay =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isSameDay) {
    return new Intl.DateTimeFormat(locale,
      {
        hour: "2-digit",
        minute: "2-digit",
      }).format(date);
  }

  return new Intl.DateTimeFormat(locale,
    {
      day: "2-digit",
      month: "short",
    }).format(date);
}
