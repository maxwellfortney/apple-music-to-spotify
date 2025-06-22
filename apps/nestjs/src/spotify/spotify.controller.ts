import { Body, Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { CommonSong } from "@workspace/types";
import { AuthGuard } from "../auth/auth.guard";
import { SpotifyService } from "./spotify.service";

@Controller("spotify")
export class SpotifyController {
    constructor(private readonly spotifyService: SpotifyService) {}

    @Get("queue")
    @UseGuards(AuthGuard)
    async getQueue(@Request() req: Request) {
        return this.spotifyService.getQueue(req.headers);
    }

    @Get("playback-state")
    @UseGuards(AuthGuard)
    async getPlaybackState(@Request() req: Request) {
        return this.spotifyService.getPlaybackState(req.headers);
    }

    @Post("queue")
    @UseGuards(AuthGuard)
    async addToQueue(@Body() body: { song: CommonSong }, @Request() req: Request) {
        return this.spotifyService.addToQueue(body.song, req.headers);
    }

    @Post("next")
    @UseGuards(AuthGuard)
    async skipToNext(@Request() req: Request) {
        return this.spotifyService.skipToNext(req.headers);
    }

    @Post("previous")
    @UseGuards(AuthGuard)
    async skipToPrevious(@Request() req: Request) {
        return this.spotifyService.skipToPrevious(req.headers);
    }
}
