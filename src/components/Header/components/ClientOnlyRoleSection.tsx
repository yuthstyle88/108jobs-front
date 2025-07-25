"use client";
import { useState, useEffect } from 'react';
import { UserService } from "@/services";
import { RoleType } from "lemmy-js-client";
import EmployerSection from './EmployerSection';
import FreelancerSession from './FreelancerSection';
import {GlobalLanguage} from "@/types/language";

interface ClientOnlyRoleSectionProps {
  globalLanguageData?: Partial<GlobalLanguage> | null | undefined;
}

const ClientOnlyRoleSection = ({ globalLanguageData }: ClientOnlyRoleSectionProps) => {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Return empty div during server-side rendering
    return <div></div>;
  }

  const role = UserService.Instance.authInfo?.claims?.role || "Guest";
  const isEmployer = role === RoleType.Employer;
  const isFreelancer = role === RoleType.Freelancer;

  return (
    <>
      {isFreelancer && <FreelancerSession globalLanguageData={globalLanguageData} />}
      {isEmployer && <EmployerSection globalLanguageData={globalLanguageData} />}
    </>
  );
};

export default ClientOnlyRoleSection;