import { Body, Controller, Get, Post } from "@nestjs/common";
import { CommonSong } from "@workspace/types";
import { HackService } from "./hack.service";

@Controller("hack")
export class HackController {
    constructor(private readonly hackService: HackService) {}

    @Get("maxwell/queue")
    async getMaxwellQueue() {
        return this.hackService.getMaxwellQueue();
    }

    @Get("maxwell/playback-state")
    async getMaxwellPlaybackState() {
        return this.hackService.getMaxwellPlaybackState();
    }

    @Post("maxwell/queue")
    async addAppleMusicUrlToMaxwellSpotifyQueue(@Body() body: { song: CommonSong }) {
        return this.hackService.addAppleMusicUrlToMaxwellSpotifyQueue(body.song);
    }

    @Post("maxwell/player/next")
    async skipMaxwellToNext() {
        return this.hackService.skipMaxwellToNext();
    }

    @Post("maxwell/player/previous")
    async skipMaxwellToPrevious() {
        return this.hackService.skipMaxwellToPrevious();
    }
}
