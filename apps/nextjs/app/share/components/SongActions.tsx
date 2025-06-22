import { env } from '@workspace/env/nextjs';
import { CommonSong } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";

interface SongActionsProps {
    song: CommonSong;
    refetchQueue: () => Promise<void>;
}

export function SongActions({ song, refetchQueue }: SongActionsProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const addToQueue = async () => {
        if (song.provider !== "apple-music") {
            setError("Only Apple Music songs can be added to Maxwell's queue");
            return;
        }

        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            const response = await fetch(`${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/hack/maxwell/queue`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ song }),
            });

            if (!response.ok) {
                throw new Error("Failed to add song to queue");
            }

            setIsSuccess(true);
            await refetchQueue();
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 pt-4">
            <Button 
                onClick={addToQueue}
                disabled={isLoading || song.provider !== "apple-music"}
                className="w-full"
            >
                {isLoading ? "Adding to queue..." : isSuccess ? "Added to queue!" : "Add to Maxwell's Queue"}
            </Button>
            
            {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            
            {song.provider !== "apple-music" && (
                <p className="text-sm text-gray-500 text-center">
                    Only Apple Music songs can be added to Maxwell's queue
                </p>
            )}
        </div>
    );
} 