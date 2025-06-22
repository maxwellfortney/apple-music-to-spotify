import { env } from '@workspace/env/nextjs';
import { CommonSong } from "@workspace/types";
import { useCallback, useEffect, useState } from "react";
import { SpotifyQueueData } from "../types/spotify";

type QueueType = "user" | "maxwell";

interface UseSpotifyQueueReturn {
    queueData: SpotifyQueueData | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
    addToQueue: (song: CommonSong) => Promise<void>;
}

interface UseSpotifyQueueOptions {
    queueType?: QueueType;
    autoRefresh?: boolean;
    refreshInterval?: number;
    fetchOnMount?: boolean;
}

export function useSpotifyQueue(options: UseSpotifyQueueOptions = {}): UseSpotifyQueueReturn {
    const { 
        queueType = "user", 
        autoRefresh = false, 
        refreshInterval = 5000,
        fetchOnMount = true
    } = options;
    const [queueData, setQueueData] = useState<SpotifyQueueData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchQueue = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const endpoint = queueType === "maxwell" 
                ? `${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/hack/maxwell/queue`
                : `${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/spotify/queue`;
            
            const response = await fetch(endpoint, {
                credentials: "include",
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch ${queueType === "maxwell" ? "Maxwell's" : "user"} queue: ${response.status}`);
            }
            
            const data = await response.json();
            setQueueData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to fetch ${queueType === "maxwell" ? "Maxwell's" : "user"} queue`);
        } finally {
            setLoading(false);
        }
    }, [queueType]);

    const addToQueue = useCallback(async (song: CommonSong) => {
        try {
            if (queueType === "user") {
                // Add to user's queue (supports both Spotify and Apple Music)
                const response = await fetch(`${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/spotify/queue`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({ song }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to add track to user queue: ${response.status}`);
                }
            } else if (queueType === "maxwell") {
                // Add to Maxwell's queue (only supports Apple Music)
                if (song.provider !== "apple-music") {
                    throw new Error("Only Apple Music songs can be added to Maxwell's queue");
                }

                const response = await fetch(`${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/hack/maxwell/queue`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ song }),
                });

                if (!response.ok) {
                    throw new Error(`Failed to add track to Maxwell's queue: ${response.status}`);
                }
            }

            // Refresh the queue after adding
            await fetchQueue();
        } catch (err) {
            setError(err instanceof Error ? err.message : `Failed to add track to ${queueType === "maxwell" ? "Maxwell's" : "user"} queue`);
            throw err;
        }
    }, [queueType, fetchQueue]);

    useEffect(() => {
        if (fetchOnMount) {
            fetchQueue();
        }
    }, [fetchQueue, fetchOnMount]);

    useEffect(() => {
        if (!autoRefresh) return;

        const interval = setInterval(fetchQueue, refreshInterval);
        return () => clearInterval(interval);
    }, [autoRefresh, refreshInterval, fetchQueue]);

    return {
        queueData,
        loading,
        error,
        refetch: fetchQueue,
        addToQueue,
    };
} 