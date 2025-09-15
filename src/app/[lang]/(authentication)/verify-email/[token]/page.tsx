import {VerifyEmailRegister} from "@/components/Authentication/VerifyEmailRegister";

export default async function Page({
  params,
}: {
  params: any;
}) {
  return <VerifyEmailRegister code={params.token}/>;
}
