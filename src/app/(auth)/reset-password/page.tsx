"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/validations/resetPassword.validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { getAccount } from "@/lib/appwrite";
import PasswordInput from "@/components/PasswordInput";
import { Check, Plus, Key } from "lucide-react";
import { useState } from "react";

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const userId = searchParams.get("userId");
    const secret = searchParams.get("secret");

    const [backendError, setBackendError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<ResetPasswordFormValues>({
        resolver: zodResolver(resetPasswordSchema),
        mode: "onChange",
    });

    const password = useWatch({ control, name: "password" });
    const confirmPassword = useWatch({ control, name: "confirmPassword" });

    const validationData = [
        { state: /[A-Z]/.test(password || ""), text: "At least one uppercase letter" },
        { state: /[a-z]/.test(password || ""), text: "At least one lowercase letter" },
        { state: /[0-9]/.test(password || ""), text: "At least one number" },
        { state: /[^a-zA-Z0-9]/.test(password || ""), text: "At least one symbol" },
        { state: (password || "").length >= 8, text: "Minimum 8 characters" },
        {
            state: password && confirmPassword && password === confirmPassword,
            text: "Passwords match"
        }
    ];

    const onSubmit = async (data: ResetPasswordFormValues) => {
        setBackendError("");
        setSuccessMessage("");
        setIsLoading(true);

        try {
            const account = getAccount();
            await account.updateRecovery(userId!, secret!, data.password);
            setSuccess(true);
            setSuccessMessage("Password updated successfully. You can now log in, redirecting to login page...");
            setTimeout(() => router.push("/login"), 2000);
        } catch (err: any) {
            setBackendError(err?.message || "Invalid or expired reset link.");
        } finally {
            setIsLoading(false);
        }
    };

    if (!userId || !secret) {
        return (
            <main className="min-h-screen flex justify-center items-center">
                <p className="text-sm text-red-600">Invalid reset link, try resending it again</p>
            </main>
        );
    }

    return (
        <main className="h-auto flex my-16 lg:h-[calc(100vh-5rem)]">
            {!success ? (
                <>
                    <div className="w-full m-auto flex justify-center items-center flex-col px-5">
                        <Key className="w-14 h-14 mb-5" />
                        <h1 className="sm:text-4xl font-medium text-2xl">Reset Your Password</h1>
                        <p className="mt-3 text-center font-normal text-black/50">
                            Enter the new password that you want to set.
                        </p>
                        <form onSubmit={handleSubmit(onSubmit)} className="mt-7 w-full px-4 flex flex-col gap-4">
                            <PasswordInput
                                placeholder="New Password"
                                {...register("password")}
                            />
                            {errors.password && (
                                <p className="text-red-500 text-sm ml-2">{errors.password.message}</p>
                            )}
                            <PasswordInput
                                placeholder="Confirm New Password"
                                {...register("confirmPassword")}
                            />
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm ml-2">{errors.confirmPassword.message}</p>
                            )}

                            <div className="space-y-1 mt-2 mb-2">
                                {validationData.map(({ state, text }) => (
                                    <div className="flex items-center gap-2 text-sm" key={text}>
                                        {state ? (
                                            <Check className="w-4 text-green-600" />
                                        ) : (
                                            <Plus className="rotate-45 w-4 text-gray-400" />
                                        )}
                                        <span className={state ? "text-green-600" : "text-gray-500"}>{text}</span>
                                    </div>
                                ))}
                            </div>

                            {backendError && (
                                <p className="text-red-500 text-sm text-center">{backendError}</p>
                            )}

                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Resetting..." : "Reset Password"}
                            </Button>
                        </form>
                    </div>
                </>
            ) : (
                <div className="w-full flex justify-center items-center text-center text-green-600 text-xs">
                    {successMessage}
                </div>
            )}
        </main>
    );
}
