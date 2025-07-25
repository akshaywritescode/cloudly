"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Loader from "@/components/Loader";
import { getAccount } from "@/lib/appwrite";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const user = await getCurrentUser();

            if (!user) {
                router.replace("/auth/login");
                return;
            }

            if (!user.emailVerification) {
                localStorage.setItem("verify-email", user.email);
                router.replace("/sent-verify-mail");
                const account = getAccount();
                await account.createVerification(`${window.location.origin}/verify-account`);
                return;
            }

            setIsLoading(false);
        };

        checkAuth();
    }, [router]);

    if (isLoading) return <Loader />;

    return <>{children}</>;
}
