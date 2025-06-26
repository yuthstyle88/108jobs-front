import { SWRConfiguration } from "swr";

const swrConfig: SWRConfiguration = {
  revalidateOnFocus: true,
  shouldRetryOnError: false, 
  revalidateOnReconnect: true,
};

export default swrConfig;
