import { CreateOAuthProvider } from "../../lib/lemmy-js-client";

export type ProviderToEdit = Omit<
  CreateOAuthProvider,
  "clientId" | "clientSecret"
>;
