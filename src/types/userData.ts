export type User = {
    id: string;
    role_id: string;
    coin_id: string;
    profile_id: string;
    contact_id: string;
    password_hash: string;
    confirmed_status: boolean;
    created_at: string;
    updated_at: string;
    username: string;
    display_name: string;
    avatar_url: string;
    birth_date: string;
    member_since: string;
  };
  
  export type Coin = {
    id: string;
    balance: string;
    created_at: string;
    updated_at: string;
  };
  export type Role = "employer" | "freelancer";
  
  export type Profile = {
    id: string;
    bio: string | null;
    average_response_time: string | null;
    created_at: string;
    updated_at: string;
    membership_level_id: string;
    is_verified: boolean;
    freelancer_type: string;
  };
  
  export type Contact = {
    id: string;
    email: string;
    phone_number: string | null;
    created_at: string;
    updated_at: string;
  };
  export type Address = {
    id: string;
  country: string;
  province: string | null;
  district_or_subdistrict: string | null;
  subdistrict_or_district: string | null;
  address_details: string | null;
  zip_code: string | null;
  created_at: string; 
  updated_at: string;
  };

  export type Card = {
    id: string;
    front_card: string;
    back_card: string;
    title: string;
    name: string;
    surname: string;
    address_details: string;
    zip_code: string;
    subdistrict_or_district: string;
    district_or_subdistrict: string;
    province: string;
    card_number: string;
  };
  
  
  // Main type for profile data response
  export type ProfileData = {
    user: User;
    coin: Coin;
    roles: Role[];
    profile: Profile;
    contact: Contact;
    address: Address;
    card: Card;
  };
  