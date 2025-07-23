import {RoleType} from "lemmy-js-client";

export type User = {
  id: string;
  roleId: string;
  coinId: string;
  profileId: string;
  contactId: string;
  passwordHash: string;
  confirmedStatus: boolean;
  createdAt: string;
  updatedAt: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  birthDate: string;
  memberSince: string;
};

export type Coin = {
  id: string;
  balance: string;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  bio: string | null;
  averageResponseTime: string | null;
  createdAt: string;
  updatedAt: string;
  membershipLevelId: string;
  isVerified: string;
  freelancerType: string;
};

export type Contact = {
  id: string;
  email: string;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
};
export type Address = {
  id: string;
  country: string;
  province: string | null;
  districtOrSubdistrict: string | null;
  subdistrictOrDistrict: string | null;
  addressDetails: string | null;
  zipCode: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Card = {
  id: string;
  frontCard: string;
  backCard: string;
  title: string;
  name: string;
  surname: string;
  addressDetails: string;
  zipCode: string;
  subdistrictOrDistrict: string;
  districtOrSubdistrict: string;
  province: string;
  cardNumber: string;
};

export type ProfileData = {
  user: User;
  coin: Coin;
  roles: RoleType;
  profile: Profile;
  contact: Contact;
  address: Address;
  card: Card;
  showCountrySelectionBox: false;
  isNewBuyer: false;
};
