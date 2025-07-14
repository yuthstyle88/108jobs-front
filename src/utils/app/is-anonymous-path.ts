export default function isAnonymousPath(pathname: string) {
  return /^\/(signIn.*|signup|password_change.*|verify_email.*)\b/g.test(
    pathname,
  );
}
