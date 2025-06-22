import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { User } from "better-auth";

interface UserInfoCardProps {
    user: User;
}

export function UserInfoCard({ user }: UserInfoCardProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Your current account details</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    <div>
                        <span className="font-medium">Email:</span> {user.email}
                    </div>
                    <div>
                        <span className="font-medium">User ID:</span> {user.id}
                    </div>
                    <div>
                        <span className="font-medium">Created:</span> {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
} 