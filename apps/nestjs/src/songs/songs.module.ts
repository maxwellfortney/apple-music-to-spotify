import { Module } from "@nestjs/common";
import { AppleMusicProvider } from "./apple-music/apple-music.provider";
import { AppleMusicService } from "./apple-music/apple-music.service";
import { SongsController } from "./songs.controller";
import { SongsProvider } from "./songs.provider";
import { SongsService } from "./songs.service";

@Module({
    controllers: [SongsController],
    providers: [SongsService, SongsProvider, AppleMusicService, AppleMusicProvider],
    exports: [SongsService, SongsProvider],
})
export class SongsModule {}
