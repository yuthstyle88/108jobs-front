"use client";
import Loading from "@/components/Loading";
import CurrentProfileEmployer from "../components/CurrentProfileEmployer";
import CurrentProfileFreelance from "../components/CurrentProfileFreelance";
import EmployerProfile from "../components/EmployerProfile";
import FreelancerProfile from "../components/FreelanerProfile";
import {RoleType} from "lemmy-js-client";
import {useMyUser} from "@/hooks/profile-api/useMyUser";
import NotFound from "@/app/not-found";

interface Props {
  username: string;
}

export default function CheckRoleProfile({ username }: Props) {
  const { profileData, isLoadingProfile } = useMyUser();
  const localUser = profileData?.localUserView.localUser;

  if (isLoadingProfile) return <Loading />;

  const isEmployer = localUser?.role === RoleType.Employer;
  const isFreelancer = localUser?.role === RoleType.Freelancer;


  if (isEmployer) return <CurrentProfileEmployer />;
  if (isFreelancer)
    return <CurrentProfileFreelance />;
  if (isFreelancer)
    return <FreelancerProfile />;
  if (isEmployer) return <EmployerProfile  />;

  return <NotFound />;
}
