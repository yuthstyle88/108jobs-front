export default function isAnonymousPath(pathname: string) {
  return /^\/(login.*|register|passwordChange.*|verifyEmail.*)\b/g.test(
    pathname,
  );
}
