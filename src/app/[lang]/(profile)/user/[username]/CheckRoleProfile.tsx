"use client";

import { API_ROUTES } from "@/api/endpoints";
import NotFound from "@/app/not-found";
import Loading from "@/components/Loading";
import { usePrivateFetch, usePrivateFetchParams } from "@/hooks/api-hooks";
import { ProfileShow } from "@/types/freelancerPofile";
import { ProfileData } from "@/types/userData";
import CurrentProfileEmployer from "../components/CurrentProfileEmployer";
import CurrentProfileFreelance from "../components/CurrentProfileFreelance";
import EmployerProfile from "../components/EmployerProfile";
import FreelancerProfile from "../components/FreelanerProfile";

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
  const roles = userProfile?.roles || [];

  const isCurrentUser = userProfile?.userId === user?.user.id;
  const isCurrentEmployer =
    isCurrentUser &&
    roles.includes("employer") &&
    !roles.includes("freelancer");
  const isCurrentFreelance = isCurrentUser && roles.includes("freelancer");
  const isEmployer = roles.includes("employer") && !isCurrentUser;
  const isFreelancer = roles.includes("freelancer") && !isCurrentFreelance;

  if (isCurrentEmployer) return <CurrentProfileEmployer username={username} />;
  if (isCurrentFreelance)
    return <CurrentProfileFreelance username={username} />;
  if (isEmployer && isFreelancer)
    return <FreelancerProfile username={username} />;
  if (isEmployer) return <EmployerProfile username={username} />;

  return <NotFound />;
}
