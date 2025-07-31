import CheckRoleProfile from "./CheckRoleProfile";

export default async function Page({
  params,
}: {
  params: Promise<{username: string}>;
}) {
  const resolvedParams = await params;

  return <CheckRoleProfile/>;
}
