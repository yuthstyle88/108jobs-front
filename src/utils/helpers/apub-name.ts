import hostname from "./hostname";

export default function getApubName({
  name,
  actorId,
}: {
  name: string;
  actorId: string;
}) {
  return `${name}@${hostname(actorId)}`;
}
