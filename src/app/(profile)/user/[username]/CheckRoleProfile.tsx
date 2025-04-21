"use client";

import { usePrivateFetch, usePrivateFetchParams } from "@/hooks/api-hooks";
import { useSession } from "next-auth/react";
import CurrentProfile from "../components/CurrentProfileFreelance/page";
import EmployerProfile from "../components/EmployerProfile/page";
import FreelancerProfile from "../components/FreelanerProfile/page";
import Loading from "@/components/Loading";
import { ProfileShow } from "@/types/freelancerPofile";
import { ProfileData } from "@/types/userData";
import { API_ROUTES } from "@/api/endpoints";
import NotFound from "@/app/not-found";
import CurrentProfileFreelance from "../components/CurrentProfileFreelance/page";
import CurrentProfileEmployer from "../components/CurrentProfileEmployer/page";

interface Props {
  username: string;
}

export default function CheckRoleProfile({ username }: Props) {
   const { data: user } = usePrivateFetch<ProfileData>(
      API_ROUTES.profile.get_profile
    );

  const { data: userProfile, isLoading,error} = usePrivateFetchParams<ProfileShow>(
    `/users/${username}`
  );

  if (isLoading) return <Loading />;
  if (error) return <NotFound />;
  const roles = userProfile?.roles || [];

  const isCurrentUser = username === user?.user.username ;
  const isCurrentEmployer = isCurrentUser && roles.includes("employer") && !roles.includes("freelancer");
  const isCurrentFreelance = isCurrentUser && roles.includes("freelancer");
  const isEmployer = roles.includes("employer") && !isCurrentUser;
  const isFreelancer = roles.includes("freelancer") && !isCurrentFreelance;
  
  if (isCurrentEmployer) return <CurrentProfileEmployer username={username} />;
  if (isCurrentFreelance) return <CurrentProfileFreelance username={username} />;
  if (isEmployer && isFreelancer) return <FreelancerProfile username={username} />;
  if (isEmployer) return <EmployerProfile username={username} />;
  
  return <NotFound/>;
}
