export interface CommonArtist {
    id: string;
    name: string;
    url?: string;
}

export interface CommonAlbum {
    id: string;
    name: string;
    images: Array<{
        url: string;
        width: number;
        height: number;
    }>;
}

export interface CommonSong {
    id: string;
    name: string;
    artistName: string;
    artists: CommonArtist[];
    album: CommonAlbum;
    durationMs: number;
    durationFormatted: string;
    explicit: boolean;
    url: string;
    provider: "apple-music" | "spotify";
    previewUrl?: string;
    releaseDate?: string;
    isrc?: string;
    trackNumber?: number;
    discNumber?: number;
    genres?: string[];
    hasLyrics?: boolean;
}
