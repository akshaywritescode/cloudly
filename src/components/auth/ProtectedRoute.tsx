"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { getAccount, getDatabase } from "@/lib/appwrite";
import { Query } from "appwrite";
import Loader from "@/components/Loader";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_USERS_DB_ID as string;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USER_METADATA_COLLECTION_ID as string;

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname(); // 🔥 To know current path

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = await getCurrentUser();

                if (!user) {
                    router.replace("/login");
                    setIsLoading(false);
                    return;
                }

                if (!user.emailVerification) {
                    localStorage.setItem("verify-email", user.email);
                    const account = getAccount();
                    await account.createVerification(`${window.location.origin}/verify-account`);
                    router.replace("/sent-verify-mail");
                    setIsLoading(false);
                    return;
                }

                // Skip onboarding check on onboarding page
                if (pathname === "/onboarding") {
                    setIsLoading(false);
                    return;
                }

                // Check onboarding status
                const databases = getDatabase();
                try {
                    const res = await databases.listDocuments(
                        databaseId,
                        collectionId,
                        [Query.equal("userId", user.$id)]
                    );

                    const metadata = res.documents[0];

                    if (!metadata?.onboardingCompleted) {
                        router.replace("/onboarding");
                        setIsLoading(false);
                        return;
                    }

                } catch (err) {
                    console.error("Failed to fetch user metadata:", err);
                    router.replace("/onboarding");
                    setIsLoading(false);
                    return;
                }

                setIsLoading(false);
            } catch (error) {
                console.error("Authentication check failed:", error);
                router.replace("/login");
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [router, pathname]);

    if (isLoading) return <Loader />;

    return <>{children}</>;
}
