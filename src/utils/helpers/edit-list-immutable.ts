type ImmutableListKey =
  | "comment"
  | "commentReply"
  | "personMention"
  | "community"
  | "privateMessage"
  | "post"
  | "postReport"
  | "commentReport"
  | "privateMessageReport"
  | "registrationApplication";

export default function editListImmutable<
  T extends { [key in F]: { id: number } },
  F extends ImmutableListKey,
>(fieldName: F, data: T, list: T[]): T[] {
  return [
    ...list.map(c => (c[fieldName].id === data[fieldName].id ? data : c)),
  ];
}
