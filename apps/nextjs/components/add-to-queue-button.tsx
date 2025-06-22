"use client";

import { CommonSong } from "@workspace/types";
import { Button } from "@workspace/ui/components/button";
import { useState } from "react";
import { useSpotifyQueue } from "../hooks/useSpotifyQueue";

interface AddToQueueButtonProps {
    song: CommonSong;
    queueType?: "user" | "maxwell";
    className?: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}

export function AddToQueueButton({ 
    song, 
    queueType = "user", 
    className,
    onSuccess,
    onError 
}: AddToQueueButtonProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { addToQueue, refetch: refetchUserQueue } = useSpotifyQueue({ 
        queueType,
        autoRefresh: false,
        fetchOnMount: false
    });

    const onClick = async () => {
        setIsLoading(true);
        setError(null);
        setIsSuccess(false);

        try {
            if(queueType === "maxwell") {
                if(song.provider !== "apple-music") {
                    throw new Error("Only Apple Music songs can be added to Maxwell's queue");
                }
            }

            await addToQueue(song);
            await refetchUserQueue();



            setIsSuccess(true);
            onSuccess?.();
            
            // Reset success state after 2 seconds
            setTimeout(() => setIsSuccess(false), 2000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An error occurred";
            setError(errorMessage);
            onError?.(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const getButtonText = () => {
        if (isLoading) return "Adding...";
        if (isSuccess) return "Added!";
        return queueType === "maxwell" ? "Add to Maxwell's Queue" : "Add to Queue";
    };

    const getButtonVariant = () => {
        if (isSuccess) return "secondary";
        return "default";
    };

    const isDisabled = () => {
        if (isLoading) return true;
        if (queueType === "maxwell" && song.provider !== "apple-music") return true;
        return false;
    };

    return (
        <div className={`flex flex-col gap-3 ${className || ""}`}>
            <Button 
                onClick={onClick}
                disabled={isDisabled()}
                variant={getButtonVariant()}
                className="w-full"
            >
                {getButtonText()}
            </Button>
            
            {error && (
                <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            
            {queueType === "maxwell" && song.provider !== "apple-music" && (
                <p className="text-sm text-gray-500 text-center">
                    Only Apple Music songs can be added to Maxwell's queue
                </p>
            )}
        </div>
    );
} 