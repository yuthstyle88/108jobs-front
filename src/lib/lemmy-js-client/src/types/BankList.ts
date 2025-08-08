export type Bank = {
  id: number;
  name: string;
  country: string;
  bankCode: string;
  swiftCode: string;
};

export type BanksResponse = {
  banks: Bank[];
};
