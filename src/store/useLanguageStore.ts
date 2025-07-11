import { LanguageFile } from "@/constants/language";
import {
  BreadCrumb,
  Commission,
  ErrorPageLanguage,
  GlobalLanguage,
  GoToProfile,
  HomeLanguage,
  LoginLanguage,
  NotFoundPageLanguage,
  ProfileApplyLanguage,
  ProfileBasicInfoLanguage,
  ProfileChatLanguage,
  ProfileCoinLanguage,
  ProfileCompanyInfoLanguage,
  ProfileConsentLanguage,
  ProfileContactInfoLanguage,
  ProfileCouponLanguage,
  ProfileIndividualLanguage,
  ProfileJobBoardLanguage,
  ProfileNavbarAccountLanguage,
  ProfileRewardLanguage,
  ProfileUserEdit,
  SellerAccountStatistics,
  SellerBankAccount,
  SellerCommitmentLetter,
  SellerContactInfo,
  SellerCreateJobs,
  SellerDocumentInfo,
  SellerFreelanceProfile,
  SellerMyService,
  SellerOverview,
  SellerPersonalInfo,
  SellerProjectManagement,
  SellerWithdrawal,
  ApplyFreelancerSuccessLanguage,
  JobPostCreate,
  ApplyToBeFreelancerLanguage,
  NotificationLanguage,
  JobCardLanguage,
  JobCategoryLanguage,
  JobDetailLanguage,
  TermAndConditionLanguage,
  CategoryFooterLanguage
} from "@/types/language";
import { create } from "zustand";

// Raw JSON từ mỗi file
export type LanguageDataType = Partial<
  GlobalLanguage &
    LoginLanguage &
    HomeLanguage &
    ProfileCoinLanguage &
    ProfileBasicInfoLanguage &
    ProfileCompanyInfoLanguage &
    ProfileIndividualLanguage &
    ProfileContactInfoLanguage &
    ProfileChatLanguage &
    ProfileApplyLanguage &
    ProfileCouponLanguage &
    ProfileConsentLanguage &
    ProfileJobBoardLanguage &
    ProfileRewardLanguage &
    ProfileNavbarAccountLanguage &
    NotFoundPageLanguage &
    ErrorPageLanguage &
    SellerOverview &
    SellerProjectManagement &
    SellerAccountStatistics &
    SellerMyService &
    SellerWithdrawal &
    SellerCreateJobs &
    SellerFreelanceProfile &
    SellerPersonalInfo &
    SellerContactInfo &
    SellerBankAccount &
    SellerCommitmentLetter &
    SellerDocumentInfo &
    BreadCrumb &
    GoToProfile &
    ProfileUserEdit &
    Commission &
    ApplyFreelancerSuccessLanguage &
    JobPostCreate &
    ApplyToBeFreelancerLanguage &
    NotificationLanguage &
    JobCardLanguage &
    JobCategoryLanguage &
    JobDetailLanguage &
    TermAndConditionLanguage & 
    CategoryFooterLanguage
>;

type LanguageStoreData = {
  data: LanguageDataType;
  lang: string;
};

type LanguageData = {
  [key in LanguageFile]?: LanguageStoreData;
};

type LanguageStore = {
  languageData: LanguageData;
  setLanguageData: (
    data: LanguageData | ((prevData: LanguageData) => LanguageData)
  ) => void;
};

export const useLanguageStore = create<LanguageStore>((set) => ({
  languageData: {},
  setLanguageData: (data) =>
    set((state) => ({
      languageData:
        typeof data === "function"
          ? data(state.languageData || {})
          : { ...state.languageData, ...data },
    })),
}));
