"use client";
import {useEffect, useState} from 'react';
import {UserService} from "@/services";
import {RoleType} from "lemmy-js-client";
import EmployerSection from './EmployerSection';
import FreelancerSession from './FreelancerSection';

interface ClientOnlyRoleSectionProps {
  globalLanguageData?: Record<string, string>;
}

const ClientOnlyRoleSection = ({globalLanguageData}: ClientOnlyRoleSectionProps) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
      setIsClient(true);
    },
    []);

  if (!isClient) {
    // Return empty div during server-side rendering
    return <div></div>;
  }

  const role = UserService.Instance.authInfo?.claims?.role || "Guest";
  const isEmployer = role === RoleType.Employer;
  const isFreelancer = role === RoleType.Freelancer;

  return (
    <>
      {isFreelancer && <FreelancerSession />}
      {isEmployer && <EmployerSection />}
    </>
  );
};

export default ClientOnlyRoleSection;