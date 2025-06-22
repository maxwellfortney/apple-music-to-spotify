import { CommonSong } from "@workspace/types";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { AddToQueueButton } from "../../../components/add-to-queue-button";
import { PlayNowButton } from "../../../components/play-now-button";
import { SongHeader } from "./SongHeader";

interface SongCardProps {
    song: CommonSong;
    refetchQueue: () => Promise<void>;
}

export function SongCard({ song, refetchQueue }: SongCardProps) {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader className="pb-4 sm:pb-6">
                <SongHeader song={song} />
            </CardHeader>
            
            <CardContent className="space-y-4 sm:space-y-6">                
                <div className="flex flex-col gap-3">
                    <PlayNowButton 
                        song={song} 
                        queueType="maxwell"
                        onSuccess={refetchQueue}
                        className="flex-1"
                    />
                    <AddToQueueButton 
                        song={song} 
                        queueType="maxwell"
                        onSuccess={refetchQueue}
                        className="flex-1"
                    />
                </div>
            </CardContent>
        </Card>
    );
} 