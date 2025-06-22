import { env } from '@workspace/env/nextjs';
import { CommonSong } from "@workspace/types";
import { useEffect, useState } from "react";

interface UseSongDetailsReturn {
    songDetails: CommonSong | null;
    loading: boolean;
    error: string | null;
}

export function useSongDetails(songUrl?: string): UseSongDetailsReturn {
    const [songDetails, setSongDetails] = useState<CommonSong | null>(null);
    const [loading, setLoading] = useState(!!songUrl);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchSongDetails = async () => {
            if (!songUrl) {
                setLoading(false);
                return;
            }
            
            setLoading(true);
            setError(null);
            
            try {
                // If already encoded, decode first, then re-encode to ensure consistent encoding
                const decodedSongUrl = isUriEncoded(songUrl) ? decodeURIComponent(songUrl) : songUrl;
                const encodedSongUrl = encodeURIComponent(decodedSongUrl);
                const response = await fetch(`${env.NEXT_PUBLIC_SERVER_BASE_URL}/api/songs/${encodedSongUrl}`, {
                    credentials: "include",
                });
                
                if (!response.ok) {
                    // Try to extract error message from response body
                    let errorMessage = `Failed to fetch song details: ${response.status}`;
                    
                    try {
                        const errorData = await response.json();
                        if (errorData.message) {
                            errorMessage = errorData.message;
                        } else if (errorData.error) {
                            errorMessage = errorData.error;
                        }
                    } catch {
                        // If we can't parse the error response, fall back to status text
                        errorMessage = response.statusText || `HTTP ${response.status}`;
                    }
                    
                    throw new Error(errorMessage);
                }
                
                const data = await response.json();
                setSongDetails(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch song details');
            } finally {
                setLoading(false);
            }
        };

        fetchSongDetails();
    }, [songUrl]);

    return { songDetails, loading, error };
}

function isUriEncoded(uri: string) {
    try {
        decodeURIComponent(uri);
        return true;
    } catch (error) {
        return false;
    }
} 