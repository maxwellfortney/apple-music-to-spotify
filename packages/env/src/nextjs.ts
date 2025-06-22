import { createEnv } from "@t3-oss/env-nextjs";
import z from "zod";

export const env = createEnv({
    client: {
        NEXT_PUBLIC_SERVER_BASE_URL: z.string().url(), // ex: "https://server.test.com"
        NEXT_PUBLIC_CLIENT_DOMAIN: z.string(), // ex: "subtest.test.com"
    },
    experimental__runtimeEnv: {
        NEXT_PUBLIC_SERVER_BASE_URL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
        NEXT_PUBLIC_CLIENT_DOMAIN: process.env.NEXT_PUBLIC_CLIENT_DOMAIN,
    },
});
