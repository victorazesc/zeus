import { IAppConfig } from "@/types/app";

export async function getEnvConfig(): Promise<IAppConfig | null> {
    return new Promise((resolve, reject) => {
        const envs = {
            google_client_id: process.env.GOOGLE_CLIENT_ID
        }
        resolve(envs)
    })
}