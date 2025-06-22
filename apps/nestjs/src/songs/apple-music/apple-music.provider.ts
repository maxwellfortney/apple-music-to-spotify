import { Injectable, Logger } from "@nestjs/common";
import { env } from "@workspace/env/nestjs";

@Injectable()
export class AppleMusicProvider {
    private readonly logger = new Logger(AppleMusicProvider.name);

    getDeveloperToken() {
        return env.APPLE_MUSIC_DEVELOPER_JWT;
    }
}
