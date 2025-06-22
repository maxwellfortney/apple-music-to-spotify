export interface AppleMusicArtwork {
    width: number;
    height: number;
    url: string;
    bgColor: string;
    textColor1: string;
    textColor2: string;
    textColor3: string;
    textColor4: string;
}

export interface AppleMusicPlayParams {
    id: string;
    kind: string;
}

export interface AppleMusicPreview {
    url: string;
}

export interface AppleMusicResource {
    id: string;
    type: string;
    href: string;
}

export interface AppleMusicRelationships {
    artists: {
        href: string;
        data: AppleMusicResource[];
    };
    albums: {
        href: string;
        data: AppleMusicResource[];
    };
}

export interface AppleMusicSongAttributes {
    albumName: string;
    genreNames: string[];
    trackNumber: number;
    durationInMillis: number;
    releaseDate: string;
    isrc: string;
    artwork: AppleMusicArtwork;
    composerName: string;
    url: string;
    playParams: AppleMusicPlayParams;
    discNumber: number;
    isAppleDigitalMaster: boolean;
    hasLyrics: boolean;
    name: string;
    previews: AppleMusicPreview[];
    contentRating: string;
    artistName: string;
}

export interface AppleMusicSong {
    id: string;
    type: string;
    href: string;
    attributes: AppleMusicSongAttributes;
    relationships: AppleMusicRelationships;
}

export interface AppleMusicGetSongResponse {
    data: AppleMusicSong[];
}
