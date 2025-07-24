"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import Loader from "@/components/Loader";

export default function PublicRoute({ children }: { children: React.ReactNode }) {
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const user = await getCurrentUser();

      if (user) {
        router.replace("/dashboard");
      } else {
        setIsChecking(false);
      }
    };

    checkSession();
  }, [router]);

  if (isChecking) return <Loader />;

  return <>{children}</>;
}
