import { Inject, Injectable, Logger } from "@nestjs/common";
import { AccessToken as SpotifySdkAccessToken } from "@spotify/web-api-ts-sdk";
import type { Auth } from "better-auth";
import { AUTH_INSTANCE_KEY } from "../auth/symbols";

@Injectable()
export class SpotifyProvider {
    private readonly logger = new Logger(SpotifyProvider.name);

    constructor(@Inject(AUTH_INSTANCE_KEY) private readonly auth: Auth) {}

    async getSpotifySdkAccessTokenFormatted(headers?: HeadersInit): Promise<SpotifySdkAccessToken> {
        const accessToken = await this.getAccessToken(headers);
        return {
            access_token: accessToken,
            token_type: "Bearer",
            expires_in: 3600,
            refresh_token: "",
        };
    }

    async getAccessToken(headers?: HeadersInit): Promise<string> {
        try {
            // For now, we'll use a simplified approach
            // In a real implementation, you would use the auth instance to get user data
            // This is a placeholder that should be updated based on the actual better-auth API

            // TODO: Replace this with actual better-auth API calls
            console.log("headers", headers);
            const getAccessTokenResponse = await this.auth.api.getAccessToken({
                body: {
                    providerId: "spotify",
                },
                headers: headers || {},
            });

            console.log("getAccessTokenResponse", getAccessTokenResponse);

            if (!getAccessTokenResponse.accessToken) {
                throw new Error("No access token found");
            }

            return getAccessTokenResponse.accessToken;
        } catch (error) {
            this.logger.error(`Error getting access token:`, error);
            throw error;
        }
    }
}
