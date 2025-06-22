import { createEnv } from "@t3-oss/env-core";
import z from "zod";

export const env = createEnv({
    server: {
        PORT: z.coerce.number().default(3001),
        DATABASE_URL: z.string().url(),

        TRUSTED_ORIGINS: z.string().transform((val) => val.split(",")),
        CROSS_DOMAIN_ORIGIN: z.string(), // ex: ".test.com"
        BETTER_AUTH_URL: z.string().url(),

        // mailjet
        MJ_APIKEY_PUBLIC: z.string(),
        MJ_APIKEY_PRIVATE: z.string(),

        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),

        SPOTIFY_CLIENT_ID: z.string(),
        SPOTIFY_CLIENT_SECRET: z.string(),

        APPLE_MUSIC_DEVELOPER_JWT: z.string(),

        // The target of who's spotify account will be played on
        TARGET_USER_ID: z.string(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});
