export default function isAuthPath(pathname: string) {
  return /^\/(create.*?|inbox|settings|admin|reports|registrationApplications|activitypub.*?)\b/g.test(
    pathname,
  );
}
