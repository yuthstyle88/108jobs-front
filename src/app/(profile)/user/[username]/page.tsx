import CurrentProfile from "../components/CurrentProfile/page";

export default function Page({ params }: { params: { username: string } }) {
  return <CurrentProfile username={params.username} />;
}
