'use client';

import { getAccount } from '@/lib/appwrite';
import { useRouter } from 'next/navigation';

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            const account = getAccount()
            await account.deleteSession('current');
            router.push('/');
        } catch (err: any) {
            alert('Failed to logout: ' + err.message);
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
            Logout
        </button>
    );
}
