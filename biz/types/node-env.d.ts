declare namespace NodeJS {
    export interface ProcessEnv {
        KEYCLOAK_CLIENT_ID: string;
        KEYCLOAK_CLIENT_SECRET: string;
        KEYCLOAK_ISSUER: string;
        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;
        AXIOS_BASE_URL: string;
    }
}
