import { Card, CardContent } from "@workspace/ui/components/card";

interface ErrorStateProps {
    error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
    // Determine if this is a user-friendly error or a technical error
    const isUserFriendlyError = error.includes("Invalid song URL") || 
                               error.includes("Failed to determine song provider") ||
                               error.includes("Song not found");

    return (
        <div className="flex items-center justify-center min-h-[400px] px-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    <div className="text-center">
                        <div className="mb-4">
                            <div className="w-12 h-12 mx-auto mb-3 bg-destructive/10 rounded-full flex items-center justify-center">
                                <span className="text-destructive text-xl">⚠️</span>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">
                                {isUserFriendlyError ? "Unable to load song" : "Something went wrong"}
                            </h3>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-4">
                            {error}
                        </p>
                        
                        {isUserFriendlyError && (
                            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                                <p className="mb-2">Please check that:</p>
                                <ul className="text-left space-y-1">
                                    <li>• The song URL is valid and accessible</li>
                                    <li>• The song is from Spotify or Apple Music</li>
                                    <li>• You have the necessary permissions to access this song</li>
                                </ul>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 