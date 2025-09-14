export function getAppName(): string {
  // On the server we can read APP_NAME; on the client we must rely on NEXT_PUBLIC_APP_NAME
  if (typeof window === 'undefined') {
    return process.env.APP_NAME || process.env.NEXT_PUBLIC_APP_NAME || '${getAppName()}';
  }
  // Client side
  return process.env.NEXT_PUBLIC_APP_NAME || '${getAppName()}';
}
export function getAppUrl(): string {
  // On the server we can read APP_NAME; on the client we must rely on NEXT_PUBLIC_APP_NAME
  if (typeof window === 'undefined') {
    return process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://${getAppName()}.com';
  }
  // Client side
  return process.env.NEXT_PUBLIC_APP_NAME || 'http://108jobs.com';
}
