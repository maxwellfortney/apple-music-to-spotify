import { env } from '@workspace/env/nextjs';
import { useCallback } from "react";

type PlaybackControlType = "user" | "maxwell";

interface UsePlaybackControlsProps {
    type?: PlaybackControlType;
}

interface UsePlaybackControlsReturn {
    skipToPrevious: () => Promise<void>;
    skipToNext: () => Promise<void>;
}

export function usePlaybackControls(options: UsePlaybackControlsProps = {}): UsePlaybackControlsReturn {
    const { type = 'user' } = options;

    const skipToPrevious = useCallback(async () => {
        try {
            const endpoint = type === "maxwell"
                ? `${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/hack/maxwell/player/previous`
                : `${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/spotify/previous`;

            const response = await fetch(endpoint, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Failed to skip to previous track: ${response.status}`);
            }
        } catch (error) {
            console.error("Error skipping to previous track:", error);
            throw error;
        }
    }, [type]);

    const skipToNext = useCallback(async () => {
        try {
            const endpoint = type === "maxwell"
                ? `${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/hack/maxwell/player/next`
                : `${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/spotify/next`;
                
            const response = await fetch(endpoint, {
                method: "POST",
                credentials: "include",
            });

            if (!response.ok) {
                throw new Error(`Failed to skip to next track: ${response.status}`);
            }
        } catch (error) {
            console.error("Error skipping to next track:", error);
            throw error;
        }
    }, [type]);

    return {
        skipToPrevious,
        skipToNext,
    };
} 