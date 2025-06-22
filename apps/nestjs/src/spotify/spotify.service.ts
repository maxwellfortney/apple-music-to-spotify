import { Injectable, Logger } from "@nestjs/common";
import { type AccessToken, type PlaybackState, type Queue, SpotifyApi } from "@spotify/web-api-ts-sdk";
import { env } from "@workspace/env/nestjs";
import { CommonSong } from "@workspace/types";
import { SpotifyProvider } from "./spotify.provider";

@Injectable()
export class SpotifyService {
    private readonly logger = new Logger(SpotifyService.name);

    constructor(private readonly spotifyProvider: SpotifyProvider) {}

    private async createSpotifyApi(headers?: HeadersInit): Promise<SpotifyApi> {
        const accessTokenString = await this.spotifyProvider.getAccessToken(headers);

        // Construct the AccessToken object that the SDK expects
        const accessToken: AccessToken = {
            access_token: accessTokenString,
            token_type: "Bearer",
            expires_in: 3600, // Default to 1 hour, should be updated with actual expiry
            refresh_token: "", // This would need to be provided by the auth system
        };

        return SpotifyApi.withAccessToken(env.SPOTIFY_CLIENT_ID, accessToken);
    }

    private async getAccessToken(headers?: HeadersInit): Promise<string> {
        return await this.spotifyProvider.getAccessToken(headers);
    }

    private async makeSpotifyApiCall<T = { success: true }>(
        url: string,
        method: string = "POST",
        accessToken: string,
        errorMessage: string,
        returnJson: boolean = false,
    ): Promise<T> {
        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            const errorText = await response.text();
            this.logger.error(`Spotify API error: ${response.status} - ${errorText}`);
            throw new Error(`${errorMessage}: ${response.status}`);
        }

        if (returnJson) {
            return (await response.json()) as T;
        }

        return { success: true } as T;
    }

    async getQueue(headers?: HeadersInit): Promise<Queue> {
        try {
            const spotifyApi = await this.createSpotifyApi(headers);
            const queue = await spotifyApi.player.getUsersQueue();
            this.logger.log(`Successfully fetched queue`);
            return queue;
        } catch (error) {
            this.logger.error(`Error fetching user queue:`, error);
            throw error;
        }
    }

    /**
     * Shared method to fetch any Spotify playback state
     * @param spotifyApi The SpotifyApi instance to use
     */
    async getSpotifyPlaybackState(spotifyApi: SpotifyApi): Promise<PlaybackState> {
        try {
            const playbackState = await spotifyApi.player.getPlaybackState();
            this.logger.log(`Successfully fetched playback state`);
            return playbackState;
        } catch (error) {
            this.logger.error(`Error fetching playback state:`, error);
            throw error;
        }
    }

    async getPlaybackState(headers?: HeadersInit): Promise<PlaybackState> {
        try {
            const spotifyApi = await this.createSpotifyApi(headers);
            return await this.getSpotifyPlaybackState(spotifyApi);
        } catch (error) {
            this.logger.error(`Error fetching playback state:`, error);
            throw error;
        }
    }

    async addToQueue(song: CommonSong, headers?: HeadersInit): Promise<void> {
        try {
            const accessToken = await this.getAccessToken(headers);
            await this.addSongToSpotifyQueue(song, accessToken);
        } catch (error) {
            this.logger.error(`Error adding track to queue:`, error);
            throw error;
        }
    }

    async skipToNext(headers?: HeadersInit): Promise<void> {
        try {
            const accessToken = await this.getAccessToken(headers);
            await this.makeSpotifyApiCall(
                "https://api.spotify.com/v1/me/player/next",
                "POST",
                accessToken,
                "Failed to skip to next track",
            );
            this.logger.log(`Successfully skipped to next track`);
        } catch (error) {
            this.logger.error(`Error skipping to next track:`, error);
            throw error;
        }
    }

    async skipToPrevious(headers?: HeadersInit): Promise<void> {
        try {
            const accessToken = await this.getAccessToken(headers);
            await this.makeSpotifyApiCall(
                "https://api.spotify.com/v1/me/player/previous",
                "POST",
                accessToken,
                "Failed to skip to previous track",
            );
            this.logger.log(`Successfully skipped to previous track`);
        } catch (error) {
            this.logger.error(`Error skipping to previous track:`, error);
            throw error;
        }
    }

    /**
     * Shared method to fetch any Spotify queue
     * @param spotifyApi The SpotifyApi instance to use
     */
    async getSpotifyQueue(spotifyApi: SpotifyApi): Promise<Queue> {
        try {
            const queue = await spotifyApi.player.getUsersQueue();
            this.logger.log(`Successfully fetched queue`);
            return queue;
        } catch (error) {
            this.logger.error(`Error fetching queue:`, error);
            throw error;
        }
    }

    /**
     * Shared method to skip to the next track in any Spotify queue
     * @param accessToken The Spotify access token to use
     */
    async skipSpotifyTrackToNext(accessToken: string): Promise<void> {
        try {
            await this.makeSpotifyApiCall(
                "https://api.spotify.com/v1/me/player/next",
                "POST",
                accessToken,
                "Failed to skip to next track",
            );
            this.logger.log(`Successfully skipped to next track`);
        } catch (error) {
            this.logger.error(`Error skipping to next track:`, error);
            throw error;
        }
    }

    /**
     * Shared method to skip to the previous track in any Spotify queue
     * @param accessToken The Spotify access token to use
     */
    async skipSpotifyTrackToPrevious(accessToken: string): Promise<void> {
        try {
            await this.makeSpotifyApiCall(
                "https://api.spotify.com/v1/me/player/previous",
                "POST",
                accessToken,
                "Failed to skip to previous track",
            );
            this.logger.log(`Successfully skipped to previous track`);
        } catch (error) {
            this.logger.error(`Error skipping to previous track:`, error);
            throw error;
        }
    }

    /**
     * Shared method to add a song to any Spotify queue
     * @param song The song to add
     * @param accessToken The Spotify access token to use
     */
    async addSongToSpotifyQueue(song: CommonSong, accessToken: string): Promise<void> {
        try {
            let trackUri: string;

            if (song.provider === "spotify") {
                // For Spotify songs, construct the URI from the ID
                trackUri = `spotify:track:${song.id}`;
            } else if (song.provider === "apple-music") {
                // For Apple Music songs, search by ISRC to find the Spotify equivalent
                if (!song.isrc) {
                    throw new Error("Apple Music song does not have an ISRC, cannot add to Spotify queue");
                }

                // Create a temporary SpotifyApi instance for searching
                const tempAccessToken: AccessToken = {
                    access_token: accessToken,
                    token_type: "Bearer",
                    expires_in: 3600,
                    refresh_token: "",
                };
                const spotifyApi = SpotifyApi.withAccessToken(env.SPOTIFY_CLIENT_ID, tempAccessToken);

                const searchResult = await spotifyApi.search(`isrc:${song.isrc}`, ["track"], "US", 1);
                const spotifyTrack = searchResult.tracks.items[0];

                if (!spotifyTrack) {
                    throw new Error(`No Spotify equivalent found for Apple Music song: ${song.name}`);
                }

                trackUri = spotifyTrack.uri;
                this.logger.log(`Found Spotify equivalent for Apple Music song "${song.name}": ${spotifyTrack.name}`);
            } else {
                throw new Error(`Unsupported provider: ${song.provider}`);
            }

            // Add the track to the queue
            await this.makeSpotifyApiCall(
                `https://api.spotify.com/v1/me/player/queue?uri=${encodeURIComponent(trackUri)}`,
                "POST",
                accessToken,
                "Failed to add track to queue",
            );

            this.logger.log(`Successfully added track to queue: ${song.name} (${song.provider})`);
        } catch (error) {
            this.logger.error(`Error adding track to queue:`, error);
            throw error;
        }
    }
}
