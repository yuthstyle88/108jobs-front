import ChangePasswordLayout from "@/components/Authentication/ChangePasswordLayout";
import { VerifyEmailRegister } from "@/components/Authentication/VerifyEmailRegister";

export default async function Page({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const resolvedParams = await params;

  return <VerifyEmailRegister token={resolvedParams.token} />;
}
