"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Loader from "@/components/Loader";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await getCurrentUser();

            if (!user) {
                router.replace("/auth/login");
            } else {
                setIsAuthenticated(true);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) return <Loader />;

    if (!isAuthenticated) return null;

    return <>{children}</>;
}
