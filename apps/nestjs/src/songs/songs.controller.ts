import { Controller, Get, Param } from "@nestjs/common";
import { SongsService } from "./songs.service";

@Controller("songs")
export class SongsController {
    constructor(private readonly songsService: SongsService) {}

    @Get("/:songUrl")
    async getSong(@Param("songUrl") songUrl: string) {
        return this.songsService.getSong(songUrl);
    }
}
