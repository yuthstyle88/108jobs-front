export default function isAnonymousPath(pathname: string) {
  return /^\/(login.*|register|password_change.*|verify_email.*)\b/g.test(
    pathname,
  );
}
