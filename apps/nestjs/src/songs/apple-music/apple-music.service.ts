import { BadRequestException, Injectable } from "@nestjs/common";
import { CommonSong } from "@workspace/types";
import { AppleMusicProvider } from "./apple-music.provider";
import { AppleMusicGetSongResponse } from "./types/GetSong";

@Injectable()
export class AppleMusicService {
    private STOREFRONT_ID = "us";

    constructor(private readonly appleMusicProvider: AppleMusicProvider) {}

    async getSong(songUrl: string): Promise<CommonSong> {
        const developerToken = this.appleMusicProvider.getDeveloperToken();

        const songId = this.extractSongIdFromUrl(songUrl);
        if (!songId) {
            throw new BadRequestException("Invalid song URL. Failed to extract song ID.");
        }

        // fetch https://api.music.apple.com/v1/catalog/us/songs/1771890369

        const response = await fetch(`https://api.music.apple.com/v1/catalog/${this.STOREFRONT_ID}/songs/${songId}`, {
            headers: {
                Authorization: `Bearer ${developerToken}`,
            },
        });
        const data = (await response.json()) as AppleMusicGetSongResponse;
        console.log(data);

        return this.convertToCommonFormat(data);
    }

    private convertToCommonFormat(appleMusicData: AppleMusicGetSongResponse): CommonSong {
        const song = appleMusicData.data[0];
        if (!song) {
            throw new BadRequestException("No song found in response");
        }

        const attributes = song.attributes;

        return {
            id: song.id,
            name: attributes.name,
            artistName: attributes.artistName,
            artists: song.relationships.artists.data.map((artist) => ({
                id: artist.id,
                name: attributes.artistName, // Apple Music doesn't provide individual artist names in this endpoint
                url: `https://music.apple.com${artist.href}`,
            })),
            album: {
                id: song.relationships.albums.data[0]?.id || "",
                name: attributes.albumName,
                images: [
                    {
                        url: attributes.artwork.url.replace("{w}x{h}bb.jpg", "300x300bb.jpg"),
                        width: attributes.artwork.width,
                        height: attributes.artwork.height,
                    },
                ],
            },
            durationMs: attributes.durationInMillis,
            durationFormatted: this.formatDuration(attributes.durationInMillis),
            explicit: attributes.contentRating === "explicit",
            url: attributes.url,
            provider: "apple-music" as const,
            previewUrl: attributes.previews[0]?.url,
            releaseDate: attributes.releaseDate,
            isrc: attributes.isrc,
            trackNumber: attributes.trackNumber,
            discNumber: attributes.discNumber,
            genres: attributes.genreNames,
            hasLyrics: attributes.hasLyrics,
        };
    }

    private formatDuration(milliseconds: number): string {
        const minutes = Math.floor(milliseconds / 60000);
        const seconds = Math.floor((milliseconds % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, "0")}`;
    }

    extractSongIdFromUrl(url: string) {
        try {
            const urlObj = new URL(url);
            const songId = urlObj.searchParams.get("i");
            return songId;
        } catch (error) {
            console.error("Error extracting song ID from URL:", error);
            return null;
        }
    }
}
