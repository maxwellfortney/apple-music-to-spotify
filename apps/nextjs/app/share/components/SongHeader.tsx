import { CommonSong } from "@workspace/types";
import { CardDescription, CardTitle } from "@workspace/ui/components/card";
import { getProviderIcon, getProviderName } from "../utils/songUtils";

interface SongHeaderProps {
    song: CommonSong;
}

export function SongHeader({ song }: SongHeaderProps) {
    const albumImage = song.album.images[0]?.url;

    return (
        <div className="flex flex-row items-center gap-4 sm:gap-6">
            {albumImage && (
                <img 
                    src={albumImage} 
                    alt={`${song.album.name} album cover`}
                    className="w-24 h-24 rounded-lg object-cover shadow-md flex-shrink-0"
                />
            )}
            <div className="flex-1">
                <CardTitle className="text-xl sm:text-2xl font-bold mb-1 break-words">
                    {song.name}
                    {song.explicit && (
                        <span className="ml-2 text-xs bg-muted px-2 py-1 rounded">E</span>
                    )}
                </CardTitle>
                <CardDescription className="text-base sm:text-lg mb-2 break-words">
                    {song.artistName}
                </CardDescription>
                <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span>{getProviderIcon(song.provider)} {getProviderName(song.provider)}</span>
                    <span>•</span>
                    <span>{song.durationFormatted}</span>
                    {song.genres && song.genres.length > 0 && (
                        <>
                            <span>•</span>
                            <span className="truncate">{song.genres[0]}</span>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
} 