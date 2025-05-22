export const API_ROUTES = {
  image: {
    upload: "/image",
  },
  profile: {
    apply_freelancer: "/profile/apply/freelancer",
    get_profile: "/profile",
    update_Profile: "/profile/info",
    update_address_profile: "/profile/address"
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
  location:{
    get_provinces: "/profile/countries",
    get_countries: "profile/countries/search"
  }
};
export const API_ROUTES_SELLER = {
  profile: {
    update_Profile: "/freelancer/info",
    update_personal_info: "/profile/card",
    skills: "/freelancer/skills",
    work_experience: "/freelancer/work-experience",
    education: "/freelancer/education",
    certificate: "/freelancer/certificates-awards",
    languages: "/freelancer/languages",
    skill_level: "/skill-levels",
  },
  job:{
    get_job: "/freelancer/jobs",
    post_job_step_1: "/freelancer/jobs/step/1",
    post_job_step_2: "/freelancer/jobs/step/2",
    post_job_step_3: "/freelancer/jobs/step/3",
    post_job_step_4: "/freelancer/jobs/step/4",
    post_job_step_5: "/freelancer/jobs/step/5",
  }
};
