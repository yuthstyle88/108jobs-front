"use client";
import CurrentProfileEmployer from "../components/CurrentProfileEmployer";
import CurrentProfileFreelance from "../components/CurrentProfileFreelance";
import EmployerProfile from "../components/EmployerProfile";
import FreelancerProfile from "../components/FreelanerProfile";
import NotFound from "@/app/[lang]/not-found";
import {useAuthInfo} from "@/hooks/authenticate-api/useAuthInfo";


export default function CheckRoleProfile() {
  const {isEmployer, isFreelancer} = useAuthInfo();

  if (isEmployer) return <CurrentProfileEmployer/>;
  if (isFreelancer)
    return <CurrentProfileFreelance/>;
  if (isFreelancer)
    return <FreelancerProfile/>;
  if (isEmployer) return <EmployerProfile/>;

  return <NotFound/>;
}
