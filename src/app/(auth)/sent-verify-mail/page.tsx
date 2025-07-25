'use client';

import { useEffect, useState } from 'react';
import VerifyMailIllustration from "@/app/assets/verify-mail-illustration.svg"
import Image from 'next/image';
import { MailCheck } from "lucide-react"
import { Button } from '@/components/ui/button';
import { getAccount } from '@/lib/appwrite';
import { WrongMailDialog } from '@/components/auth/WrongMail';
import { useRouter } from 'next/navigation';

export default function SentVerifyMail() {
    const [email, setEmail] = useState('');
    const [resendMsgState, setResendMsgState] = useState(false);
    const router = useRouter();

    // fetch email from local storage
    useEffect(() => {
        const storedEmail = localStorage.getItem('verify-email');
        if (storedEmail) setEmail(storedEmail);
    }, []);

    // tell user that email has been resent again
    useEffect(() => {
        if (!resendMsgState) return;

        const timer = setTimeout(() => {
            setResendMsgState(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, [resendMsgState]);

    // check every 3 second that user is verified or not
    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const account = getAccount();
                const user = await account.get();
                if (user.emailVerification) {
                    router.push('/dashboard');
                }
            } catch (err) {
                // Optional: handle or log the error
            }
        }, 3000);

        return () => clearInterval(interval); // clean up on unmount
    }, []);

    async function handleResendMail() {
        const account = getAccount();
        await account.createVerification(`${window.location.origin}/verify-account`);
        setResendMsgState(true);
    }

    return (
        <main className="w-full my-10 h-auto flex flex-col-reverse justify-center items-center gap-6   lg:h-auto">
            {/* Left: Content */}
            <div className="flex flex-col justify-center items-center px-4 sm:w-[29rem] sm:px-8 lg:w-[48rem]">
                <MailCheck className="w-14 h-14 mb-5" />
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-medium">
                    Verify your email address
                </h1>
                <p className="mt-3 text-center text-black/50 font-normal">
                    To get started we sent you a confirmation link on your mail{" "}
                    <span className="text-blue-600">{email}</span>, click that link to get your Cloudly account verified.
                </p>
                <div className="flex flex-col gap-3 mt-8 lg:w-[40rem]">
                    <div className="w-full">
                        <WrongMailDialog />
                    </div>
                    <Button className="w-full cursor-pointer" onClick={handleResendMail}>
                        Resend Mail
                    </Button>
                </div>
                {resendMsgState && (
                    <span className="mt-6 text-xs text-green-600 text-center">
                        Verification email has been resent. Please check your inbox.
                    </span>
                )}
            </div>

            {/* Right: Illustration */}
            <div className="w-1/2 flex justify-center items-center lg:w-full">
                <Image
                    src={VerifyMailIllustration}
                    alt="illustration"
                    unoptimized
                    className="w-[250px] h-[250px] sm:w-[300px] sm:h-[300px] lg:w-[400px] lg:h-[400px]"
                />
            </div>
        </main>
    );
}
