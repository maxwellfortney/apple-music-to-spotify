import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from "./auth/auth.module";
import { HackModule } from "./hack/hack.module";
import { SongsModule } from "./songs/songs.module";
import { SpotifyModule } from "./spotify/spotify.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        AuthModule.forRoot({
            disableExceptionFilter: true,
        }),
        SpotifyModule,
        SongsModule,
        HackModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
