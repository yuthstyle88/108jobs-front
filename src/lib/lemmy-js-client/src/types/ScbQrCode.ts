export type ScbQrCodeBody = Record<string, unknown>;

export type ScbQrCodeRequest = {
  body: ScbQrCodeBody;
  token: string;
};

export type ScbQrCodeData = {
  qrRawData: string;
  qrImage: string;
  expiryTime?: string | null;
};

export type ScbQrCodeStatus = {
  code: number; // server uses u64/i32; represent as number in TS
  description: string;
};

export type ScbQrCodeResponse = {
  status: ScbQrCodeStatus;
  data?: ScbQrCodeData | null;
};
