import { PlaybackState } from "@spotify/web-api-ts-sdk";
import { env } from '@workspace/env/nextjs';
import { useCallback, useEffect, useState } from "react";

type PlaybackStateUser = "user" | "maxwell";

interface UsePlaybackStateReturn {
    playbackState: PlaybackState | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

interface UsePlaybackStateOptions {
    user?: PlaybackStateUser;
    autoRefresh?: boolean;
    refreshInterval?: number;
}

export function usePlaybackState(options: UsePlaybackStateOptions = {}): UsePlaybackStateReturn {
    const { 
        user = "user", 
        autoRefresh = false, 
        refreshInterval = 5000,
    } = options;

    const [playbackState, setPlaybackState] = useState<PlaybackState | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPlaybackState = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const endpoint = user === "maxwell" 
                ? `${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/hack/maxwell/playback-state`
                : `${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/spotify/playback-state`;
            
            const response = await fetch(endpoint, {
                credentials: "include",
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ${user === "maxwell" ? "Maxwell's" : "user"} playback state: ${response.status}`);
            }
            
            const data = await response.json();
            setPlaybackState(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to fetch ${user === "maxwell" ? "Maxwell's" : "user"} playback state`);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchPlaybackState();
    }, [fetchPlaybackState]);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(fetchPlaybackState, refreshInterval);
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, fetchPlaybackState]);

    return {
        playbackState,
        loading,
        error,
        refetch: fetchPlaybackState,
    };
} 