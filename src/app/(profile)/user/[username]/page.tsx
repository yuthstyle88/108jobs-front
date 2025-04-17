import CurrentProfile from "../components/CurrentProfile/page";

export default async function Page({
  params,
}: {
  params: { username: string };
}) {
  const { username } = await params;
  return <CurrentProfile username={username} />;
}
