'use client';

import { getAccount } from '@/lib/appwrite';
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function VerifyAccount() {
    const params = useSearchParams();
    const router = useRouter();

    const [status, setStatus] = useState("Verifying your account...");
    const [error, setError] = useState("")

    useEffect(() => {
        const userId = params.get('userId');
        const secret = params.get('secret');

        if (!userId || !secret) {
            setError("Invalid verification link. Please resend the link and make sure to verify it before it expires.");
            setStatus("")
            return;
        }

        (async () => {
            try {
                const account = getAccount();
                await account.updateVerification(userId, secret);
                setStatus('Your email has been verified!, Redirecting to dashboard...');
                setTimeout(() => router.push('/dashboard'), 2000);
            } catch (err: any) {
                setError(`Verification failed, ${err.message}`);
                setStatus("")
            }
        })();
    }, [params, router]);

    return (
        <div className="h-[calc(100vh-5rem)] max-w-md mx-auto mt-10 text-center">
            {status && ( <span className='text-xs text-green-600'>{status}</span> )}
            {error && ( <span className='text-xs text-red-600'>{error}</span> )}
        </div>
    );
}
