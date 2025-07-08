declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        NEXT_PUBLIC_API_BASE_URL: string;
        NEXT_PUBLIC_API_GOOGLE_URL: string;
        NEXT_PUBLIC_API_GOOGLE_BASE_URL: string;
        AUTH_SECRET: string;
        NEXT_PUBLIC_API_BASE_URL_V2: string;
    }
}

export {};
