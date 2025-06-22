"use client";

import { env } from "@workspace/env/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { useEffect, useState } from "react";
import { authClient } from "@/services/auth/auth.client";

interface MusicProvider {
    id: string;
    name: string;
    icon: React.ReactNode;
    description: string;
    scopes?: string[];
}

interface LinkedAccount {
    id: string;
    provider: string;
    createdAt: Date;
    updatedAt: Date;
    accountId: string;
    scopes: string[];
}

const musicProviders: MusicProvider[] = [
    {
        id: "spotify",
        name: "Spotify",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
        ),
        description: "Connect your Spotify account to access playlists and listening history",
        scopes: ["user-read-playback-state","user-read-currently-playing", "user-modify-playback-state"]
    },
    {
        id: "apple-music",
        name: "Apple Music",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 22C6.486 22 2 17.514 2 12S6.486 2 12 2s10 4.486 10 10-4.486 10-10 10zm-1-6v-8h2v8h-2zm4-8v8h2V8h-2z"/>
            </svg>
        ),
        description: "Connect your Apple Music account to access your music library",
    }
];

export function MusicProviderCard() {
    const [linkingProvider, setLinkingProvider] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successStates, setSuccessStates] = useState<Record<string, boolean>>({});
    const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);
    const [loadingAccounts, setLoadingAccounts] = useState(true);

    // Fetch linked accounts on component mount
    useEffect(() => {
        const fetchLinkedAccounts = async () => {
            try {
                const response = await authClient.listAccounts();
                if ('data' in response && response.data) {
                    setLinkedAccounts(response.data);
                } else {
                    setLinkedAccounts([]);
                }
            } catch (error) {
                console.error('Failed to fetch linked accounts:', error);
                setLinkedAccounts([]);
            } finally {
                setLoadingAccounts(false);
            }
        };

        fetchLinkedAccounts();
    }, []);

    const isAccountLinked = (providerId: string) => {
        return linkedAccounts.some(account => account.provider === providerId);
    };

    const handleLinkProvider = async (providerId: string) => {
        setLinkingProvider(providerId);
        setErrors(prev => ({ ...prev, [providerId]: "" }));
        setSuccessStates(prev => ({ ...prev, [providerId]: false }));

        try {
            const { data, error } = await authClient.linkSocial({
                provider: providerId,
                callbackURL: `https://${env.NEXT_PUBLIC_CLIENT_DOMAIN}/dashboard`,
                scopes: musicProviders.find(provider => provider.id === providerId)?.scopes
            });

            if (error) {
                setErrors(prev => ({ 
                    ...prev, 
                    [providerId]: error.message || `Failed to link ${providerId} account` 
                }));
            } else {
                setSuccessStates(prev => ({ ...prev, [providerId]: true }));
                // Refresh linked accounts after successful linking
                const response = await authClient.listAccounts();
                if ('data' in response && response.data) {
                    setLinkedAccounts(response.data);
                }
                // If the response includes a redirect URL, we might want to redirect
                if (data?.url) {
                    window.location.href = data.url;
                }
            }
        } catch (err) {
            setErrors(prev => ({ 
                ...prev, 
                [providerId]: `An unexpected error occurred while linking your ${providerId} account` 
            }));
        } finally {
            setLinkingProvider(null);
        }
    };

    if (loadingAccounts) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Connect Music Services</CardTitle>
                    <CardDescription>Loading your connected accounts...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-current"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Connect Music Services</CardTitle>
                <CardDescription>Link your music accounts to enable cross-platform features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {musicProviders.map((provider) => {
                    const isLinking = linkingProvider === provider.id;
                    const error = errors[provider.id];
                    const success = successStates[provider.id];
                    const isLinked = isAccountLinked(provider.id);

                    return (
                        <div key={provider.id} className="space-y-3">
                            {error && (
                                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                                    <p className="text-destructive text-sm">{error}</p>
                                </div>
                            )}
                            
                            {success && (
                                <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-md">
                                    <p className="text-green-600 text-sm">{provider.name} account linked successfully!</p>
                                </div>
                            )}

                            {isLinked ? (
                                <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-md">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            {provider.icon}
                                            <div>
                                                <p className="font-medium text-green-700">{provider.name} Connected</p>
                                                <p className="text-xs text-muted-foreground">Your account is linked and ready to use</p>
                                            </div>
                                        </div>
                                        <Button 
                                            onClick={() => handleLinkProvider(provider.id)}
                                            disabled={isLinking}
                                            variant="outline"
                                            size="sm"
                                        >
                                            {isLinking ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2"></div>
                                                    Re-linking...
                                                </>
                                            ) : (
                                                "Re-link"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <Button 
                                    onClick={() => handleLinkProvider(provider.id)}
                                    disabled={isLinking}
                                    className="w-full justify-start"
                                    variant="outline"
                                >
                                    {isLinking ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                                            Linking {provider.name}...
                                        </>
                                    ) : (
                                        <>
                                            {provider.icon}
                                            Link {provider.name} Account
                                        </>
                                    )}
                                </Button>
                            )}
                            
                            <p className="text-xs text-muted-foreground">
                                {provider.description}
                            </p>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
} 