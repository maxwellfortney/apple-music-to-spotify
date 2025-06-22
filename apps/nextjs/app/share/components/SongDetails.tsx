import { CommonSong } from "@workspace/types";

interface SongDetailsProps {
    song: CommonSong;
}

export function SongDetails({ song }: SongDetailsProps) {
    return (
        <>
            {/* Album Information */}
            <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">Album</h3>
                <p className="text-muted-foreground text-sm sm:text-base break-words">{song.album.name}</p>
            </div>

            {/* Artists */}
            {song.artists.length > 1 && (
                <div>
                    <h3 className="font-semibold mb-2 text-sm sm:text-base">Artists</h3>
                    <div className="flex flex-wrap gap-2">
                        {song.artists.map((artist) => (
                            <span 
                                key={artist.id}
                                className="inline-block bg-secondary px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm"
                            >
                                {artist.name}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Additional Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                {song.releaseDate && (
                    <div>
                        <span className="font-medium">Release Date:</span>
                        <p className="text-muted-foreground">
                            {new Date(song.releaseDate).toLocaleDateString()}
                        </p>
                    </div>
                )}
            </div>
        </>
    );
} 