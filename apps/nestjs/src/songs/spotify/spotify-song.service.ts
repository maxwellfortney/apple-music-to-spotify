import { Injectable, Logger } from "@nestjs/common";
import { SpotifyApi } from "@spotify/web-api-ts-sdk";
import { env } from "@workspace/env/nestjs";
import { CommonSong } from "@workspace/types";
import { SpotifyProvider } from "../../spotify/spotify.provider";

@Injectable()
export class SpotifySongService {
    private readonly logger = new Logger(SpotifySongService.name);

    constructor(private readonly spotifyProvider: SpotifyProvider) {}

    async getSong(songUrl: string, headers?: HeadersInit): Promise<CommonSong> {
        const spotifyApi = await this.createSpotifyApi(headers);
        const trackId = this.extractTrackIdFromUrl(songUrl);

        if (!trackId) {
            throw new Error("Invalid Spotify track URL. Failed to extract track ID.");
        }

        const track = await spotifyApi.tracks.get(trackId);
        return this.convertToCommonFormat(track);
    }

    private async createSpotifyApi(headers?: HeadersInit): Promise<SpotifyApi> {
        const accessTokenString = await this.spotifyProvider.getAccessToken(headers);

        const accessToken = {
            access_token: accessTokenString,
            token_type: "Bearer" as const,
            expires_in: 3600,
            refresh_token: "",
        };

        return SpotifyApi.withAccessToken(env.SPOTIFY_CLIENT_ID, accessToken);
    }

    private convertToCommonFormat(spotifyTrack: any): CommonSong {
        return {
            id: spotifyTrack.id,
            name: spotifyTrack.name,
            artistName: spotifyTrack.artists[0]?.name || "",
            artists: spotifyTrack.artists.map((artist: any) => ({
                id: artist.id,
                name: artist.name,
                url: artist.external_urls?.spotify,
            })),
            album: {
                id: spotifyTrack.album.id,
                name: spotifyTrack.album.name,
                images: spotifyTrack.album.images.map((image: any) => ({
                    url: image.url,
                    width: image.width,
                    height: image.height,
                })),
            },
            durationMs: spotifyTrack.duration_ms,
            durationFormatted: this.formatDuration(spotifyTrack.duration_ms),
            explicit: spotifyTrack.explicit || false,
            url: spotifyTrack.external_urls?.spotify || "",
            provider: "spotify" as const,
            previewUrl: spotifyTrack.preview_url,
            releaseDate: spotifyTrack.album.release_date,
            isrc: spotifyTrack.external_ids?.isrc,
            trackNumber: spotifyTrack.track_number,
            discNumber: spotifyTrack.disc_number,
            genres: [], // Spotify doesn't provide genres at track level
            hasLyrics: false, // Spotify doesn't provide lyrics info in this endpoint
        };
    }

    private formatDuration(milliseconds: number): string {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    private extractTrackIdFromUrl(url: string): string | null {
        try {
            const urlObj = new URL(url);
            const pathParts = urlObj.pathname.split("/");
            const trackIndex = pathParts.findIndex((part) => part === "track");

            if (trackIndex !== -1 && trackIndex + 1 < pathParts.length) {
                const trackId = pathParts[trackIndex + 1];
                return trackId || null;
            }

            return null;
        } catch (error) {
            this.logger.error("Error extracting track ID from URL:", error);
            return null;
        }
    }
}
