export interface SpotifyTrack {
    id: string;
    name: string;
    artists: Array<{
        name: string;
        external_urls: {
            spotify: string;
        };
    }>;
    album: {
        name: string;
        images: Array<{
            url: string;
            width: number;
            height: number;
        }>;
    };
    duration_ms: number;
    explicit?: boolean;
    external_urls: {
        spotify: string;
    };
}

export interface SpotifyQueueData {
    currently_playing: SpotifyTrack;
    queue: SpotifyTrack[];
} 