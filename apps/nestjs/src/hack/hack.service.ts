import { Injectable, Logger } from "@nestjs/common";
import { PlaybackState, Queue } from "@spotify/web-api-ts-sdk";
import { CommonSong } from "@workspace/types";
import { SpotifyService } from "../spotify/spotify.service";
import { HackProvider } from "./hack.provider";

@Injectable()
export class HackService {
    private readonly logger = new Logger(HackService.name);

    constructor(
        private readonly hackProvider: HackProvider,
        private readonly spotifyService: SpotifyService,
    ) {}

    async getMaxwellQueue(): Promise<Queue> {
        try {
            const spotifyApi = await this.hackProvider.createSpotifyApi();
            return await this.spotifyService.getSpotifyQueue(spotifyApi);
        } catch (error) {
            this.logger.error(`Error fetching Maxwell's queue:`, error);
            throw error;
        }
    }

    async getMaxwellPlaybackState(): Promise<PlaybackState> {
        try {
            const spotifyApi = await this.hackProvider.createSpotifyApi();
            return await this.spotifyService.getSpotifyPlaybackState(spotifyApi);
        } catch (error) {
            this.logger.error(`Error fetching Maxwell's playback state:`, error);
            throw error;
        }
    }

    async addAppleMusicUrlToMaxwellSpotifyQueue(song: CommonSong): Promise<void> {
        try {
            const accessToken = await this.hackProvider.getMaxwellSpotifyAccessToken();
            await this.spotifyService.addSongToSpotifyQueue(song, accessToken);
        } catch (error) {
            this.logger.error("Failed to add song to Maxwell's queue", error);
            throw error;
        }
    }

    async skipMaxwellToNext(): Promise<void> {
        try {
            const accessToken = await this.hackProvider.getMaxwellSpotifyAccessToken();
            await this.spotifyService.skipSpotifyTrackToNext(accessToken);
        } catch (error) {
            this.logger.error(`Error skipping Maxwell's track to next:`, error);
            throw error;
        }
    }

    async skipMaxwellToPrevious(): Promise<void> {
        try {
            const accessToken = await this.hackProvider.getMaxwellSpotifyAccessToken();
            await this.spotifyService.skipSpotifyTrackToPrevious(accessToken);
        } catch (error) {
            this.logger.error(`Error skipping Maxwell's track to previous:`, error);
            throw error;
        }
    }
}
