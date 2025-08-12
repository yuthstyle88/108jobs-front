export type LanguageProfile = {
  lang: string;
  level: string;
};

export type LanguageProfilesResponse = {
  language_profiles: LanguageProfile[];
};
