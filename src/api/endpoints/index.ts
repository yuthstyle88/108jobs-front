export const API_ROUTES = {
  image: {
    upload: "/image",
  },
  profile: {
    apply_freelancer: "/profile/apply/freelancer",
    get_profile: "/profile",
    update_Profile: "/profile/info",
  },
  catalog: {
    get_all_catalog: "/service/catalogs-all",
  },
  auth: {
    change_password: "/users/password-change",
    forgot_password: "/email/reset/password",
    login_google: "/login/google",
    register: "/email/send/verify",
    resend_change_email: "/profile/contact/send/email",
    verify_email: "/users/verify-email",
    resend_verify_email: "/users/resend-verify-email",
    verify_change_email: "/profile/contact/verify/email",
    update_password: "/profile/change/password",
    verify_forgot_password: "/users/verify/reset-password",
  },
};
