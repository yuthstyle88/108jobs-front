export type LanguageDataType = Partial<
  GlobalLanguage &
    LoginLanguage &
    HomeLanguage &
    ProfileCoinLanguage &
    ProfileBasicInfoLanguage &
    ProfileContactInfoLanguage &
    ProfileIndividualLanguage &
    ProfileCompanyInfoLanguage &
    ProfileChatLanguage &
    ProfileApplyLanguage &
    ProfileCouponLanguage &
    ProfileConsentLanguage &
    ProfileJobBoardLanguage &
    ProfileRewardLanguage &
    ProfileNavbarAccountLanguage &
    NotFoundPageLanguage &
    ErrorPageLanguage
>
export interface GlobalLanguage {
  label_employment_button: string;
  label_seller_center: string;
  label_apply_to_be_freelancer_button: string;
  label_login_button: string;
  hint_text_header_search: string;
  tittle_popular_header_search: string;
  tittle_header_menu_section_1: string;
  label_menu_option_1_1: string;
  hint_label_menu_option_find_hire: string;
  label_menu_option_1_2: string;
  hint_label_menu_option_search_job_board: string;
  label_menu_option_1_3: string;
  hint_freelance_search_assistant: string;
  tittle_header_menu_section_2: string;
  label_menu_option_2_1: string;
  hint_hire_on_behalf: string;
  label_menu_option_2_2: string;
  hint_freelance_services_business: string;
  label_go_job_button: string;
  label_nav_bar_item_1: string;
  label_nav_bar_item_2: string;
  label_nav_bar_item_3: string;
  label_nav_bar_item_4: string;
  label_nav_bar_item_5: string;
  label_nav_bar_item_6: string;
  label_nav_bar_item_7: string;
  label_nav_bar_item_8: string;
  label_nav_bar_item_9: string;
  label_nav_bar_item_10: string;
  tittle_footer_1: string;
  tittle_footer_2: string;
  label_apply_freelancer: string;
  label_start_selling_work: string;
  label_payment_wages: string;
  label_employment_guarantee: string;
  label_knowledge_blog: string;
  label_faq: string;
  label_manage_data_usage: string;
  label_product_title: string;
  tittle_footer_3: string;
  label_product_fastwork: string;
  label_product_fastwork_business: string;
  label_about_fastwork_title: string;
  tittle_footer_4: string;
  label_feedback_us: string;
  label_work_with_fastwork: string;
  label_terms_of_service: string;
  label_privacy_policy: string;
  label_contact_us_title: string;
  tittle_footer_5: string;
  label_working_hours_title: string;
  label_working_hours_weekdays: string;
  label_working_hours_weekends: string;
  label_notification: string;
  label_empty_notification: string;
  label_view_profile: string;
  menu_account_settings: string;
  menu_messages_orders: string;
  menu_coupons: string;
  menu_favorite_jobs: string;
  menu_job_board: string;
  menu_become_freelancer: string;
  menu_data_management: string;
  menu_logout: string;
}

export interface LoginLanguage {
  button_login_facebook: string;
  button_login_google: string;
  button_proceed: string;
  label_contact_email_phone: string;
  label_freelancer_verified: string;
  label_guaranteed_pay: string;
  label_hiring_advice: string;
  label_or: string;
  label_professional_license: string;
  label_refund_policy: string;
  link_create_account: string;
  link_forgot_password: string;
  placeholder_email_phone: string;
  subtitle_safe_money: string;
  title_hire_through: string;
  title_login_create_account: string;
  title_create_account: string;
  label_username: string;
  placeholder_username: string;
  error_username_length: string;
  label_email: string;
  placeholder_email: string;
  error_email_invalid: string;
  label_password: string;
  placeholder_password: string;
  error_password_length: string;
  label_confirm_password: string;
  placeholder_confirm_password: string;
  label_phone: string;
  placeholder_phone: string;
  error_phone_length: string;
  checkbox_terms_conditions: string;
  checkbox_privacy_policy: string;
  checkbox_email_promotion: string;
  button_create_account: string;
  title_verify_email: string;
  message_verification_sent: string;
  message_enter_code: string;
  button_verify_email: string;
  button_resend_code: string;
  verification_message: string;
  send_code_button: string;
  verification_forgot_message: string;
  enter_code_prompt: string;
  change_password_title: string;
  change_password_button: string;
  confirm_button: string;
  checkbox_terms_conditions_redirect: string;
  checkbox_privacy_policy_redirect: string;
}

export interface HomeLanguage {
  title_banner_home_page_1: string;
  title_banner_home_page_2: string;
  label_see_more_tittle: string;
  tittle_primary_why_section: string;
  tittle_secondary_why_section: string;
  tittle_first_slogan: string;
  tittle_second_slogan: string;
  tittle_third_slogan: string;
  title_start_hiring_section: string;
  label_start_hiring_section_1: string;
  content_start_hiring_section_1: string;
  label_start_hiring_section_2: string;
  content_start_hiring_section_2: string;
  label_start_hiring_section_3: string;
  content_start_hiring_section_3: string;
  label_start_hiring_section_4: string;
  content_start_hiring_section_4: string;
  label_recommend_section: string;
  tittle_quality_offer_section: string;
  content_quality_offer_freelancer_card_1: string;
  content_quality_offer_freelancer_card_2: string;
  tittle_quality_offer_specialist_card: string;
  content_quality_offer_specialist_card_1: string;
  content_quality_offer_specialist_card_2: string;
  content_quality_offer_specialist_card_3: string;
  content_quality_offer_specialist_card_4: string;
  tittle_quality_offer_professional_card: string;
  content_quality_offer_professional_card_1: string;
  content_quality_offer_professional_card_2: string;
  content_quality_offer_professional_card_3: string;
  content_quality_offer_professional_card_4: string;
  content_quality_offer_professional_card_5: string;
  content_quality_offer_professional_card_6: string;
  title_banner: string;
  subtitle_banner: string;
  button_banner: string;
  label_freelancers_popular_logo: string;
  title_featured_works: string;
  label_reviews_customer: string;
  title_trusted_companies: string;
  title_platform: string;
  title_job_categories: string;
  button_job_categories_view_more: string;
  button_download_app: string;
  subtitle_download_app: string;
}

export interface ProfileCoinLanguage {
  title_fastwork_coin: string;
  subtitle_fastwork_coin: string;
  label_your_coin: string;
  label_specify_amount: string;
  note_min_max: string;
  placeholder_specify_amount: string;
  button_top_up: string;
  label_choose_amount: string;
  button_top_up_5000: string;
  button_top_up_10000: string;
  section_top_up_history: string;
  note_balance_update: string;
  table_payment_code: string;
  table_date_transaction: string;
  table_top_up_amount: string;
  table_special_bonus: string;
  table_total_coins: string;
  table_payment_method: string;
  table_status: string;
  status_waiting: string;
  button_proceed_payment: string;
  note_coin_terms: string[];
}

export type ProfileBasicInfoLanguage = {
  section_account_info: string;
  subtitle_account_info: string;
  label_username: string;
  placeholder_username: string;
  label_display_name: string;
  placeholder_display_name: string;
  label_birthdate: string;
  section_password: string;
  password_description: string;
  button_set_password: string;
};

export type ProfileContactInfoLanguage = {
  section_contact_info: string;
  subtitle_contact_info: string;
  label_contact_email: string;
  label_contact_phone: string;
  note_contact_phone: string;
  placeholder_contact_phone: string;
  section_address_info: string;
  subtitle_address_info: string;
  label_current_location: string;
  option_thailand: string;
  option_foreign_country: string;
  placeholder_select_country: string;
};

export type ProfileIndividualLanguage = {
  section_individual_hiring: string;
  subtitle_individual_hiring: string;
  label_first_name: string;
  placeholder_first_name: string;
  label_last_name: string;
  placeholder_last_name: string;
};

export type ProfileCompanyInfoLanguage = {
  section_company_hiring: string;
  subtitle_company_hiring: string;
  label_tax_id: string;
  placeholder_tax_id: string;
  button_search_company: string;
  process_title_register_company: string;
  process_description_register: string;
  process_title_approval: string;
  process_description_approval: string;
  process_title_notify_freelancer: string;
  process_description_notify: string;
  note_requirements: string[];
};

export type ProfileChatLanguage = {
  section_chat: string;
  label_filter_jobs: string;
  checkbox_unhired_only: string;
  label_no_conversation: string;
  search_placeholder: string;
  job_branch: string;
  time_ago: string;
  guide: string;
  details: string;
  selected_here: string;
  days: string;
  secure_payment_note: string;
  unselect_warning: string;
  type_message_here: string;
};

export type ProfileApplyLanguage = {
  subtitle: string;
  apply_button: string;
  advantages_title: string;
  increase_hiring: string;
  increase_hiring_description: string;
  payment_security: string;
  payment_security_description: string;
  paperwork: string;
  paperwork_description: string;
  support_team: string;
  support_team_description: string;
  career_growth: string;
  career_growth_description: string;
  privileges: string;
  privileges_description: string;
  steps_title: string;
  step1: string;
  step1_description: string;
  step2: string;
  step2_description: string;
  step3: string;
  step3_description: string;
  step4: string;
  step4_description: string;
  step5: string;
  step5_description: string;
  step6: string;
  step6_description: string;
  freelancer_types_title: string;
  freelancer_standard: string;
  freelancer_standard_description: string;
  freelancer_specialist: string;
  freelancer_specialist_description: string;
  freelancer_professional: string;
  freelancer_professional_description: string;
  why_choose_title: string;
  popular_categories_title: string;
  freelance_types_title: string;
  freelancer_title: string;
  freelancer_label: string;
  freelancer_1: string;
  freelancer_2: string;
  freelancer_3: string;
  freelancer_4: string;
  freelancer_5: string;
  freelancer_6: string;
  specialist_title: string;
  specialist_label: string;
  specialist_1: string;
  specialist_2: string;
  specialist_3: string;
  specialist_4: string;
  specialist_5: string;
  specialist_6: string;
  specialist_7: string;
  professional_title: string;
  professional_label: string;
  professional_1: string;
  professional_2: string;
  professional_3: string;
  professional_4: string;
  professional_5: string;
  sell_steps_title: string;
  sell_step_1_title: string;
  sell_step_1_desc_prefix: string;
  sell_step_1_link_text: string;
  sell_step_2_title: string;
  sell_step_2_desc: string;
  sell_step_3_title: string;
  sell_step_3_desc_prefix: string;
  sell_step_3_link_1: string;
  sell_step_3_desc_middle: string;
  sell_step_3_link_2: string;
  sell_step_3_desc_suffix: string;
  sell_step_4_title: string;
  sell_step_4_desc: string;
  sell_step_5_title: string;
  sell_step_5_desc: string;
  sell_step_6_title: string;
  sell_step_6_desc_prefix: string;
  sell_step_6_link_text: string;
  sell_step_6_desc_suffix: string;
  cta_title: string;
  cta_button: string;
  why_title: string;
  popular_categories: string;
};

export type ProfileCouponLanguage = {
  section_discounts_promotions: string;
  subtitle_discounts_promotions: string;
  label_your_coupons: string;
  description_your_coupons: string;
  message_no_coupons: string;
  section_special_offers: string;
  description_special_offers: string;
  tab_for_hiring: string;
  tab_for_freelancers: string;
  message_no_offers: string;
};

export type ProfileConsentLanguage = {
  data_management: string;
  terms_conditions: string;
  data_usage_fastwork: string;
  cookies_management: string;
  third_party_data_sharing: string;
  newsletter_promotions: string;
  newsletter_accept: string;
  newsletter_decline: string;
  save_data: string;
  no_freelancer_favorites: string;
  functional_cookies: string;
  functional_cookies_description: string;
  marketing_cookies: string;
  marketing_cookies_description: string;
  analytics_cookies: string;
  analytics_cookies_description: string;
  toggle_marketing_cookies: string;
  toggle_analytics_cookies: string;
  mandatory_cookies: string;
};

export type ProfileJobBoardLanguage = {
  section_job_board: string;
  subtitle_job_board: string;
  tab_all_jobs: string;
  tab_saved_jobs: string;
  dropdown_search_category: string;
  dropdown_search_type: string;
  button_post_job: string;
  label_selected_jobs: string;
  table_header_title: string;
  table_header_category: string;
  table_header_job_type: string;
  table_header_budget: string;
  table_header_post_date: string;
  table_header_deadline: string;
  label_pagination: string;
  section_assistant: string;
  description_assistant: string;
  assistant_feature1: string;
  assistant_feature2: string;
  assistant_feature3: string;
  button_learn_more: string;
};

export type ProfileRewardLanguage = {
  section_rewards_points: string;
  label_total_points: string;
  tab_collect_points: string;
  tab_redeem_rewards: string;
  tab_usage_history: string;
  section_free_points_mission: string;
  filter_all: string;
  filter_general: string;
  filter_employment: string;
  label_general_mission: string;
  label_employment_mission: string;
  task_daily_points: string;
  task_first_payment: string;
  task_successful_hire: string;
  task_repeat_hire: string;
  task_first_job_post: string;
  button_check_get_points: string;
  label_view_other_rewards: string;
  section_awards: string;
  button_all_awards: string;
  button_for_employment: string;
  section_general: string;
  label_discount: string;
  award_50_baht_coupon: string;
  award_100_baht_coupon: string;
  award_300_baht_coupon: string;
  award_500_baht_coupon: string;
  award_1000_baht_coupon: string;
  award_3000_baht_coupon: string;
  award_5000_baht_coupon: string;
  label_points: string;
  label_cached: string;
  tab_earned_points: string;
  tab_redeemed_expired: string;
  column_date_received: string;
  column_details: string;
  column_points_amount: string;
  label_no_data: string;
  section_terms_conditions: string;
  terms_1: string;
  terms_2: string;
  terms_3: string;
  section_faq: string;
  faq_join_rewards: string;
  faq_join_rewards_answer: string;
  faq_more_points: string;
  faq_more_points_answer: string;
  faq_benefits: string;
  faq_benefits_answer: string;
  faq_expiration: string;
  faq_expiration_answer: string;
};

export type ProfileNavbarAccountLanguage = {
  section_account: string;
  account_info: string;
  contact_info: string;
  section_hiring: string;
  personal_hiring_info: string;
  company_hiring_info: string;
};

export type NotFoundPageLanguage = {
  error_title: string;
  error_description: string;
  back_button: string;
  recommended_section_title: string;
};
export type ErrorPageLanguage = {
  title: string;
};
