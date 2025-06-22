"use client";

import { usePlaybackControls } from "../../../hooks/usePlaybackControls";
import { usePlaybackState } from "../../../hooks/usePlaybackState";
import { useSpotifyQueue } from "../../../hooks/useSpotifyQueue";
import { SpotifyQueue } from "../../dashboard/components/SpotifyQueue";
import { useSongDetails } from "../hooks/useSongDetails";
import { EmptyState } from "./EmptyState";
import { ErrorState } from "./ErrorState";
import { LoadingState } from "./LoadingState";
import { PlaybackControls } from "./PlaybackControls";
import { SongCard } from "./SongCard";

interface ShareAuthenticatedProps {
    songUrl?: string;
}

export function ShareAuthenticated({ songUrl }: ShareAuthenticatedProps) {
    const { songDetails, loading, error } = useSongDetails(songUrl);
    const { 
        queueData: maxwellQueueData, 
        loading: maxwellQueueLoading, 
        error: maxwellQueueError,
        refetch: refetchMaxwellQueue 
    } = useSpotifyQueue({ 
        queueType: "maxwell",
        autoRefresh: true
    });
    const { playbackState: maxwellPlaybackState } = usePlaybackState({
        user: "maxwell",
        autoRefresh: true,
    });
    const { skipToPrevious, skipToNext } = usePlaybackControls({ type: "maxwell" });

    const handlePrevious = async () => {
        await skipToPrevious();
        // Refetch the queue to show the updated state
        await refetchMaxwellQueue();
    };

    const handleSkip = async () => {
        await skipToNext();
        // Refetch the queue to show the updated state
        await refetchMaxwellQueue();
    };

    if (!songUrl) {
        return <EmptyState message="No song URL provided" />;
    }

    if (loading) {
        return <LoadingState />;
    }

    if (error) {
        return <ErrorState error={error} />;
    }

    if (!songDetails) {
        return <EmptyState message="No song details available" />;
    }

    return (
        <div className="container mx-auto px-4 py-4 sm:py-8 space-y-6">
            <SongCard song={songDetails} refetchQueue={refetchMaxwellQueue} />
        
            <SpotifyQueue 
                queueData={maxwellQueueData} 
                loading={maxwellQueueLoading} 
                error={maxwellQueueError}
                playbackState={maxwellPlaybackState}
                title="Maxwell's Queue"
                controls={
                    <PlaybackControls 
                        onPrevious={handlePrevious}
                        onSkip={handleSkip}
                        disabled={maxwellQueueLoading}
                    />
                }
            />
        </div>
    );
}