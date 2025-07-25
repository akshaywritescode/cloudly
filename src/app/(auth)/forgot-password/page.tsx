"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Lock } from "lucide-react";
import ForgotPasswordIllustration from "@/app/assets/forgot-password-illustration.svg";
import Image from "next/image";
import { getAccount } from "@/lib/appwrite";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleForgotPassword = async () => {
        setMessage("");
        setError("");
        if (!email) {
            setError("Please enter your registered email.");
            return;
        }

        setIsLoading(true);
        try {
            const account = getAccount();
            await account.createRecovery(
                email,
                `${window.location.origin}/reset-password`
            );
            setMessage("Reset link sent! Please check your email.");
        } catch (error: any) {
            setError(error?.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="w-full h-auto mt-5 mb-14 flex flex-col items-center">
            <div className="w-1/2 justify-center items-center hidden lg:flex">
                <Image
                    src={ForgotPasswordIllustration}
                    alt="Forgot Password Illustration"
                    unoptimized
                    className="w-[400px] h-[400px] sm:w-[200px] sm:h-[200px]"
                />
            </div>
            <div className="w-full flex flex-col justify-center items-center px-8 md:w-[70%] lg:w-1/2">
                <Lock className="w-14 h-14 mb-5" />
                <h1 className="text-3xl font-medium lg:text-4xl">Forgot Password?</h1>
                <p className="mt-3 text-center font-normal text-black/50">
                    Forgot your password? Don’t worry — just enter your registered email below, and we’ll send you a password reset link.
                </p>
                <div className="flex flex-col gap-4 mt-7 w-full lg:flex-row">
                    <Input
                        placeholder="Email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <Button onClick={handleForgotPassword} disabled={isLoading}>
                        {isLoading ? "Sending..." : "Send Reset Link"}
                    </Button>
                </div>
                {message && (
                    <p className="mt-4 text-sm text-center text-green-600">{message}</p>
                )}
                {error && (
                    <p className="mt-4 text-sm text-center text-red-600">{error}</p>
                )}
            </div>
        </main>
    );
}
