import { env } from '@workspace/env/nextjs';
import { emailOTPClient } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
    baseURL: env.NEXT_PUBLIC_SERVER_BASE_URL,
    plugins: [emailOTPClient()],
})