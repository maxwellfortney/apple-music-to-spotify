import { BadRequestException, Injectable, Logger } from "@nestjs/common";
import { CommonSong } from "@workspace/types";
import { AppleMusicService } from "./apple-music/apple-music.service";
import { SongsProvider } from "./songs.provider";

const SONG_PROVIDER = {
    APPLE_MUSIC: "apple-music",
    SPOTIFY: "spotify",
} as const;
type SongProvider = (typeof SONG_PROVIDER)[keyof typeof SONG_PROVIDER];

@Injectable()
export class SongsService {
    private readonly logger = new Logger(SongsService.name);

    constructor(
        private readonly songsProvider: SongsProvider,
        private readonly appleMusicService: AppleMusicService,
    ) {}

    async getSong(songUrl: string): Promise<CommonSong> {
        const songProvider = await this.urlToSongProvider(songUrl);
        if (songProvider == null) {
            throw new BadRequestException("Invalid song URL. Failed to determine song provider.");
        }

        switch (songProvider) {
            case SONG_PROVIDER.APPLE_MUSIC:
                return this.appleMusicService.getSong(songUrl);
            case SONG_PROVIDER.SPOTIFY:
                throw new BadRequestException("Spotify is not supported yet");
        }
    }

    async urlToSongProvider(url: string): Promise<SongProvider | null> {
        if (url.includes("music.apple.com")) {
            return SONG_PROVIDER.APPLE_MUSIC;
        } else if (url.includes("open.spotify.com")) {
            return SONG_PROVIDER.SPOTIFY;
        }
        return null;
    }
}
