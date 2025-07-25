"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Loader from "@/components/Loader";
import { getAccount } from "@/lib/appwrite";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const user = await getCurrentUser();

      if (user) {
        if (!user.emailVerification) {
          localStorage.setItem("verify-email", user.email);
          router.replace("/sent-verify-mail");
          const account = getAccount();
          await account.createVerification(`${window.location.origin}/verify-account`);
        } else {
          router.replace("/dashboard");
        }
      } else {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [router]);

  if (isChecking) return <Loader />;

  return <>{children}</>;
}
