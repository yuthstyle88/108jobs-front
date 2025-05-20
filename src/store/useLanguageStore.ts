import { persist } from "zustand/middleware";
import { LanguageFile } from "@/constants/language";
import {
  GlobalLanguage,
  LoginLanguage,
  HomeLanguage,
  ProfileCoinLanguage,
  ProfileBasicInfoLanguage,
  ProfileCompanyInfoLanguage,
  ProfileIndividualLanguage,
  ProfileContactInfoLanguage,
  ProfileChatLanguage,
  ProfileApplyLanguage,
  ProfileCouponLanguage,
  ProfileConsentLanguage,
  ProfileJobBoardLanguage,
  ProfileRewardLanguage,
  ProfileNavbarAccountLanguage,
  NotFoundPageLanguage,
  ErrorPageLanguage,
  SellerOverview,
  SellerProjectManagement,
  SellerAccountStatistics,
  SellerMyService,
  SellerWithdrawal,
  SellerCreateJobs,
  SellerFreelanceProfile,
  SellerPersonalInfo,
  SellerContactInfo,
  SellerBankAccount,
  SellerCommitmentLetter,
  SellerDocumentInfo,
  BreadCrumb,
  GoToProfile,
  ProfileUserEdit,
  Commission
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
    Commission
>;

// Mỗi file lưu ngôn ngữ hiện tại + data
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

type CurrentLanguageStore = {
  currentLang: string;
  setCurrentLang: (lang: string) => void;
};
export const useCurrentLanguageStore = create<CurrentLanguageStore>()(
    persist(
        (set) => ({
          currentLang: 'th', // ค่าเริ่มต้น
          setCurrentLang: (lang) => set({ currentLang: lang }),
        }),
        {
          name: 'current-language'
        }
    )
);