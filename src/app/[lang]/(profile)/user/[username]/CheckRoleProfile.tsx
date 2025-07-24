"use client";

import {API_ROUTES} from "@/api/endpoints";
import NotFound from "@/app/not-found";
import Loading from "@/components/Loading";
import {usePrivateFetch, usePrivateFetchParams} from "@/hooks/api-hooks";
import {ProfileShow} from "@/types/freelancerPofile";
import {ProfileData} from "lemmy-js-client";
import CurrentProfileEmployer from "../components/CurrentProfileEmployer";
import CurrentProfileFreelance from "../components/CurrentProfileFreelance";
import EmployerProfile from "../components/EmployerProfile";
import FreelancerProfile from "../components/FreelanerProfile";
import {RoleType} from "lemmy-js-client";

interface Props {
  username: string;
}

export default function CheckRoleProfile({ username }: Props) {
  const { data: user } = usePrivateFetch<ProfileData>(
    API_ROUTES.profile.getProfile
  );

  const {
    data: userProfile,
    isLoading,
    error,
  } = usePrivateFetchParams<ProfileShow>(`/users/${username}`);

  if (isLoading) return <Loading />;
  if (error) return <NotFound />;
  const isEmployer = userProfile?.roles === RoleType.Employer;
  const isFreelancer = userProfile?.roles === RoleType.Freelancer;


  if (isEmployer) return <CurrentProfileEmployer username={username} />;
  if (isFreelancer)
    return <CurrentProfileFreelance username={username} />;
  if (isEmployer && isFreelancer)
    return <FreelancerProfile username={username} />;
  if (isEmployer) return <EmployerProfile username={username} />;

  return <NotFound />;
}
