export function getProviderIcon(provider: "apple-music" | "spotify") {
    return provider === "spotify" ? "🎵" : "🍎";
}

export function getProviderName(provider: "apple-music" | "spotify") {
    return provider === "spotify" ? "Spotify" : "Apple Music";
} 