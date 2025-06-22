"use client";

import { Button } from "@workspace/ui/components/button";
import { SkipBack, SkipForward } from "lucide-react";
import { useState } from "react";

interface PlaybackControlsProps {
    onPrevious?: () => Promise<void>;
    onSkip?: () => Promise<void>;
    disabled?: boolean;
    className?: string;
}

export function PlaybackControls({ 
    onPrevious, 
    onSkip, 
    disabled = false,
    className = "" 
}: PlaybackControlsProps) {
    const [isPreviousLoading, setIsPreviousLoading] = useState(false);
    const [isSkipLoading, setIsSkipLoading] = useState(false);

    const handlePrevious = async () => {
        if (!onPrevious || isPreviousLoading) return;
        
        setIsPreviousLoading(true);
        try {
            await onPrevious();
        } catch (error) {
            console.error("Failed to skip to previous track:", error);
        } finally {
            setIsPreviousLoading(false);
        }
    };

    const handleSkip = async () => {
        if (!onSkip || isSkipLoading) return;
        
        setIsSkipLoading(true);
        try {
            await onSkip();
        } catch (error) {
            console.error("Failed to skip to next track:", error);
        } finally {
            setIsSkipLoading(false);
        }
    };

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            <Button
                onClick={handlePrevious}
                disabled={disabled || isPreviousLoading}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                title="Previous track"
            >
                <SkipBack className="h-4 w-4" />
            </Button>
            
            <Button
                onClick={handleSkip}
                disabled={disabled || isSkipLoading}
                variant="outline"
                size="icon"
                className="h-10 w-10 rounded-full"
                title="Skip to next track"
            >
                <SkipForward className="h-4 w-4" />
            </Button>
        </div>
    );
} 