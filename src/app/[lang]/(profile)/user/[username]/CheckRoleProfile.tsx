"use client";
import Loading from "@/components/Loading";
import CurrentProfileEmployer from "../components/CurrentProfileEmployer";
import CurrentProfileFreelance from "../components/CurrentProfileFreelance";
import EmployerProfile from "../components/EmployerProfile";
import FreelancerProfile from "../components/FreelanerProfile";
import {RoleType} from "lemmy-js-client";
import {useProfileData} from "@/hooks/profile-api/useProfileData";
import NotFound from "@/app/not-found";

interface Props {
  username: string;
}

export default function CheckRoleProfile({ username }: Props) {
  const { profileState, profileData: userProfile, isLoadingProfile, mutate } = useProfileData();

  if (isLoadingProfile) return <Loading />;

  const isEmployer = userProfile?.localUser?.role === RoleType.Employer;
  const isFreelancer = userProfile?.localUser?.role === RoleType.Freelancer;


  if (isEmployer) return <CurrentProfileEmployer />;
  if (isFreelancer)
    return <CurrentProfileFreelance />;
  if (isFreelancer)
    return <FreelancerProfile />;
  if (isEmployer) return <EmployerProfile  />;

  return <NotFound />;
}
