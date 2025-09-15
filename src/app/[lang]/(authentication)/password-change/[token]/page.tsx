import ChangePasswordLayout from "@/components/Authentication/ChangePasswordLayout";

export default async function Page({
  params,
}: {
  params: any;
}) {
  return <ChangePasswordLayout token={params.token}/>;
}
