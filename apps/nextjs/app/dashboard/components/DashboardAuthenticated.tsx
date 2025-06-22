"use client";

import { useSpotifyQueue } from "../../../hooks/useSpotifyQueue";
import { MusicProviderCard } from "./MusicProviderCard";
import { SpotifyQueue } from "./SpotifyQueue";
import { UserInfoCard } from "./UserInfoCard";

interface DashboardAuthenticatedProps {
    user: any;
    session: any;
}

export function DashboardAuthenticated({ user, session }: DashboardAuthenticatedProps) {
    const { queueData, loading, error} = useSpotifyQueue({ 
        queueType: "user", 
        autoRefresh: true 
    });

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground">Welcome back, {user.email}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <UserInfoCard user={user} />
                <MusicProviderCard />
            </div>

            <SpotifyQueue queueData={queueData} loading={loading} error={error} />
        </div>
    );
}