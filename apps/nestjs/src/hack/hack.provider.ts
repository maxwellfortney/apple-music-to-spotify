import { Inject, Injectable } from "@nestjs/common";
import { SpotifyApi, type AccessToken as SpotifySdkAccessToken } from "@spotify/web-api-ts-sdk";
import { env } from "@workspace/env/nestjs";
import type { Auth } from "better-auth";
import { AUTH_INSTANCE_KEY } from "../auth/symbols";

@Injectable()
export class HackProvider {
    private MAXWELL_USER_ID = env.TARGET_USER_ID;

    constructor(@Inject(AUTH_INSTANCE_KEY) private readonly auth: Auth) {}

    async createSpotifyApi() {
        const accessToken = await this.getSpotifySdkAccessTokenFormatted();
        return SpotifyApi.withAccessToken(env.SPOTIFY_CLIENT_ID, accessToken);
    }

    async getSpotifySdkAccessTokenFormatted(): Promise<SpotifySdkAccessToken> {
        const accessToken = await this.getMaxwellSpotifyAccessToken();
        return {
            access_token: accessToken,
            token_type: "Bearer",
            expires_in: 7200, // this isnt right
            refresh_token: "", // we have the refresh token in db, but its not being returned by better auth...
        };
    }

    async getMaxwellSpotifyAccessToken() {
        const getAccessTokenResponse = await this.auth.api.getAccessToken({
            body: {
                providerId: "spotify",
                userId: this.MAXWELL_USER_ID,
            },
        });

        console.log(getAccessTokenResponse);

        if (!getAccessTokenResponse.accessToken) {
            throw new Error("Failed to get Maxwell's Spotify access token");
        }

        return getAccessTokenResponse.accessToken;
    }
}
