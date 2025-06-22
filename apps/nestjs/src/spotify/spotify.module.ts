import { Module } from "@nestjs/common";
import { SpotifyController } from "./spotify.controller";
import { SpotifyProvider } from "./spotify.provider";
import { SpotifyService } from "./spotify.service";

@Module({
    controllers: [SpotifyController],
    providers: [SpotifyService, SpotifyProvider],
    exports: [SpotifyService, SpotifyProvider],
})
export class SpotifyModule {}
