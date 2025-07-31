import {RoleType} from "@/lib/lemmy-js-client/dist/types/RoleType";
import {UserService} from "@/services";

export function useAuthInfo() {
  const auth = UserService.Instance;

  return {
    isLoggedIn: auth.isLoggedIn,
    role: auth.authInfo?.claims?.role as RoleType | undefined,
    isEmployer: auth.authInfo?.claims?.role === RoleType.Employer,
    isFreelancer: auth.authInfo?.claims?.role === RoleType.Freelancer,
    lang: auth.getLanguage,
  };
}
