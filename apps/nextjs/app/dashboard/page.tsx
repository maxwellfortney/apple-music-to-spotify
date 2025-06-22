import { env } from "@workspace/env/nextjs";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/services/auth/auth.client";
import { DashboardAuthenticated } from "./components/DashboardAuthenticated";

export default async function DashboardPage() {
    const {data, error} = await authClient.getSession({
        fetchOptions: {
            headers: await headers()
        }
    })

    if (data == null || error != null) {
        return redirect(`/login?callbackUrl=https://${env.NEXT_PUBLIC_CLIENT_DOMAIN}/dashboard`)
    }

    return (
        <DashboardAuthenticated user={data.user} session={data.session} />
    )
}