"use client";

import { PlaybackState } from "@spotify/web-api-ts-sdk";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useEffect, useRef, useState } from "react";
import { SpotifyQueueData, SpotifyTrack } from "../../../types/spotify";

interface SpotifyQueueProps {
    queueData: SpotifyQueueData | null;
    playbackState?: PlaybackState | null;
    loading?: boolean;
    error?: string | null;
    title?: string;
    controls?: React.ReactNode;
}

function formatDuration(ms: number): string {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function PlaybackProgressBar({ playbackState }: { playbackState: PlaybackState }) {
    const [progress, setProgress] = useState(playbackState.progress_ms || 0);
    const animationFrameRef = useRef<number | null>(null);

    useEffect(() => {
        setProgress(playbackState.progress_ms || 0);

        // Always clear previous frame
        if (animationFrameRef.current !== null) {
            cancelAnimationFrame(animationFrameRef.current);
        }

        if (!playbackState.is_playing) {
            return; // Don't start a new frame if not playing
        }

        const startTime = Date.now();
        const startProgress = playbackState.progress_ms || 0;

        const animate = () => {
            const elapsedTime = Date.now() - startTime;
            const newProgress = startProgress + elapsedTime;
            
            if (newProgress < playbackState.item.duration_ms) {
                setProgress(newProgress);
                animationFrameRef.current = requestAnimationFrame(animate);
            } else {
                setProgress(playbackState.item.duration_ms);
            }
        };

        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current !== null) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [playbackState]);
    
    const progressPercent = (progress / playbackState.item.duration_ms) * 100;

    return (
        <div className="w-full flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{formatDuration(progress)}</span>
            <div className="bg-gray-300 dark:bg-gray-700 rounded-full h-1 flex-grow">
                <div
                    className="bg-green-600 dark:bg-green-500 h-1 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                />
            </div>
            <span>{formatDuration(playbackState.item.duration_ms)}</span>
        </div>
    )
}

function TrackItem({ 
    track, 
    isCurrentlyPlaying = false,
    playbackState
}: { 
    track: SpotifyTrack; 
    isCurrentlyPlaying?: boolean,
    playbackState?: PlaybackState | null
}) {
    const albumImage = track.album.images.find(img => img.width === 64)?.url || track.album.images[0]?.url;
    
    const showProgressBar = isCurrentlyPlaying && playbackState && playbackState.item?.id === track.id;

    return (
        <div className={`p-2 sm:p-3 rounded-lg ${
            isCurrentlyPlaying 
                ? 'bg-green-50 border border-green-200 dark:bg-green-950/20 dark:border-green-800' 
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'
        }`}>
            <div className="flex items-center space-x-2 sm:space-x-3 w-full">
                <div className="relative flex-shrink-0">
                    <img 
                        src={albumImage} 
                        alt={track.album.name}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-md object-cover"
                    />
                    {isCurrentlyPlaying && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                        </div>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 sm:space-x-2">
                        <h3 className={`font-medium truncate text-sm sm:text-base ${
                            isCurrentlyPlaying ? 'text-green-700 dark:text-green-400' : 'text-gray-900 dark:text-gray-100'
                        }`}>
                            {track.name}
                        </h3>
                        {track.explicit && (
                            <span className="text-xs bg-gray-200 dark:bg-gray-700 px-1 rounded text-gray-600 dark:text-gray-400 flex-shrink-0">
                                E
                            </span>
                        )}
                    </div>
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 truncate">
                        {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 truncate hidden sm:block">
                        {track.album.name}
                    </p>
                </div>
                
                {!showProgressBar && (
                    <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {formatDuration(track.duration_ms)}
                    </div>
                )}
            </div>

            {showProgressBar && (
                <div className="w-full pt-2">
                    <PlaybackProgressBar playbackState={playbackState} />
                </div>
            )}
        </div>
    );
}

export function SpotifyQueue({ 
    queueData, 
    playbackState,
    loading = false, 
    error = null,
    title,
    controls
}: SpotifyQueueProps) {
    // Only show loading if there's no existing data
    if (loading && !queueData) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                        <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900 dark:border-gray-100 mx-auto mb-3 sm:mb-4"></div>
                        <p className="text-sm sm:text-base">Loading queue...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-6 sm:py-8 text-red-600 dark:text-red-400">
                        <p className="text-sm sm:text-base">Error loading queue: {error}</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (!queueData) {
        return (
            <Card>
                <CardContent>
                    <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                        <p className="text-sm sm:text-base">No queue data available</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            {title && (
                 <CardHeader className="flex flex-row items-center justify-between pb-4">
                    <CardTitle className="text-xl">{title}</CardTitle>
                    {controls}
                </CardHeader>
            )}
            <CardContent className="space-y-3 sm:space-y-4">
                {/* Currently Playing */}
                {queueData.currently_playing && (
                    <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">
                            Currently Playing
                        </h3>
                        <TrackItem 
                            track={queueData.currently_playing} 
                            isCurrentlyPlaying={true}
                            playbackState={playbackState}
                        />
                    </div>
                )}
                
                {/* Queue */}
                {queueData.queue && queueData.queue.length > 0 && (
                    <div>
                        <h3 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3 uppercase tracking-wide">
                            Up Next ({queueData.queue.length})
                        </h3>
                        <div className="space-y-1 sm:space-y-2">
                            {queueData.queue.map((track, index) => (
                                <TrackItem key={track.id} track={track} />
                            ))}
                        </div>
                    </div>
                )}
                
                {(!queueData.queue || queueData.queue.length === 0) && (
                    <div className="text-center py-6 sm:py-8 text-gray-500 dark:text-gray-400">
                        <p className="text-sm sm:text-base">No tracks in queue</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
} 