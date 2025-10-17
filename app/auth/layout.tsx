"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/auth-modules";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { isAuthenticated, isLoading, getCurrentUser } = useAuth();

    useEffect(() => {
        getCurrentUser();
    }, [getCurrentUser]);

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <Card className="w-[380px]">
                    <CardHeader>
                        <CardTitle>Loading...</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground">
                            Checking authentication status...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isAuthenticated) {
        return (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                <Card className="w-[380px]">
                    <CardHeader>
                        <CardTitle>Welcome Back!</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mb-6">You are already authenticated.</p>
                        <p className="text-sm text-muted-foreground">
                            Redirecting you to the protected area...
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return <div>{children}</div>;
}