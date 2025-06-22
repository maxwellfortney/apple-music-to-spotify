import { Card, CardContent } from "@workspace/ui/components/card";

interface EmptyStateProps {
    message: string;
}

export function EmptyState({ message }: EmptyStateProps) {
    return (
        <div className="flex items-center justify-center min-h-[400px] px-4">
            <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                    <p className="text-center text-muted-foreground">{message}</p>
                </CardContent>
            </Card>
        </div>
    );
} 