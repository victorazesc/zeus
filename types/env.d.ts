declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: 'development' | 'production' | 'test';
        PORT?: string;
        DATABASE_URL: string;
        KV_REST_API_READ_ONLY_TOKEN: string;
        KV_REST_API_TOKEN: string;
        KV_REST_API_URL: string;
        KV_URL: string;
        NX_DAEMON: string;
        POSTGRES_DATABASE: string;
        POSTGRES_HOST: string;
        POSTGRES_PASSWORD: string;
        POSTGRES_PRISMA_URL: string;
        POSTGRES_URL: string;
        POSTGRES_URL_NON_POOLING: string;
        POSTGRES_URL_NO_SSL: string;
        POSTGRES_USER: string;
        TURBO_REMOTE_ONLY: string;
        TURBO_RUN_SUMMARY: string;
        VERCEL: string;
        VERCEL_ENV: string;
        VERCEL_GIT_COMMIT_AUTHOR_LOGIN: string;
        VERCEL_GIT_COMMIT_AUTHOR_NAME: string;
        VERCEL_GIT_COMMIT_MESSAGE: string;
        VERCEL_GIT_COMMIT_REF: string;
        VERCEL_GIT_COMMIT_SHA: string;
        VERCEL_GIT_PREVIOUS_SHA: string;
        VERCEL_GIT_PROVIDER: string;
        VERCEL_GIT_PULL_REQUEST_ID: string;
        VERCEL_GIT_REPO_ID: string;
        VERCEL_GIT_REPO_OWNER: string;
        VERCEL_GIT_REPO_SLUG: string;
        VERCEL_URL: string;

        SMTP_HOST: string;
        SMTP_PORT: string;
        SMTP_USER: string;
        SMTP_PASS: string;

        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;

        NEXTAUTH_SECRET: string;
        NEXTAUTH_URL: string;

        GOOGLE_CLIENT_ID: string;
        GOOGLE_CLIENT_SECRET: string;

        UPLOADTHING_SECRET: string;
        UPLOADTHING_APP_ID: string;
    }
}
