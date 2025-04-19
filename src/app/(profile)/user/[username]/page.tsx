import CurrentProfile from "../components/CurrentProfile/page";

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = await params;

  return <CurrentProfile username={resolvedParams.username} />;
}
