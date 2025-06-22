import { Module } from "@nestjs/common";
import { SpotifyModule } from "../spotify/spotify.module";
import { HackController } from "./hack.controller";
import { HackProvider } from "./hack.provider";
import { HackService } from "./hack.service";

@Module({
    imports: [SpotifyModule],
    controllers: [HackController],
    providers: [HackService, HackProvider],
    exports: [HackService, HackProvider],
})
export class HackModule {}
