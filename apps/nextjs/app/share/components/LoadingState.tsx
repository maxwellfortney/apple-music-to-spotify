import { Card, CardContent } from "@workspace/ui/components/card";

export function LoadingState() {
    return (
        <div className="flex items-center justify-center min-h-[400px] px-4">
            <Card className="w-full max-w-md">
                <CardContent className="py-10">
                    <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
} 