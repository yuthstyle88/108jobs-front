export const API_ENDPOINTS = {
  language: {
    get: (lang: string, file: "global" | "login" | "home") =>
      `/lang/${lang}/${file}_${lang}.json`,
  },
};
