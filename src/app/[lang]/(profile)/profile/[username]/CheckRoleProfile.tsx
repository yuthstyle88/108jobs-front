"use client";
import NotFound from "@/app/[lang]/not-found";
import { useAuthInfo } from "@/hooks/authenticate-api/useAuthInfo";
import CurrentProfileUser from "../components/CurrentProfileUser";


export default function CheckRoleProfile() {
  const { isLoggedIn } = useAuthInfo();


  if (isLoggedIn)
    return <CurrentProfileUser />;
  // if (isLoggedIn)
  //   return <FreelancerProfile/>;

  return <NotFound />;
}
