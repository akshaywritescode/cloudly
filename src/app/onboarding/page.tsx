"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import onboardingImg1 from "@/app/assets/personal-illustration.svg";
import onboardingImg2 from "@/app/assets/work-illustration.svg";
import onboardingImg3 from "@/app/assets/school-illustration.svg";
import Image from "next/image";
import Logo from "@/components/ui/Logo";
import { getCurrentUser } from "@/lib/auth";
import { getDatabase } from "@/lib/appwrite";
import { Query } from "appwrite";
import { useRouter } from "next/navigation";

const databaseId = process.env.NEXT_PUBLIC_APPWRITE_USERS_DB_ID as string;
const collectionId = process.env.NEXT_PUBLIC_APPWRITE_USER_METADATA_COLLECTION_ID as string;

export default function Onboarding() {
    const [username, setUsername] = useState("");
    const [selectedCard, setSelectedCard] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getCurrentUser();
            if (user) {
                const name = user.name;
                setUsername(name.charAt(0).toUpperCase() + name.slice(1));
            }
        };
        fetchUser();
    }, []);

    const OnboardingCardData = [
        {
            CardHeading: "Personal",
            CardImage: onboardingImg1,
            CardDescription: "Edit & share photos, videos & Save Important File.",
            Dimension: [180, 180],
        },
        {
            CardHeading: "Work",
            CardImage: onboardingImg2,
            CardDescription: "Work with team or client, sync all your files to one place.",
            Dimension: [200, 200],
        },
        {
            CardHeading: "School",
            CardImage: onboardingImg3,
            CardDescription: "Collaborate on group assignment, build projects or portfolio.",
            Dimension: [200, 200],
        },
    ];

    const handleCardClick = async (purpose: string) => {
        setSelectedCard(purpose);

        const user = await getCurrentUser();
        if (!user) {
            console.error("User not found");
            return;
        }
        const databases = getDatabase();

        try {
            // Fetch metadata document
            const res = await databases.listDocuments(databaseId, collectionId, [
                Query.equal("userId", user.$id),
            ]);

            const docId = res.documents[0]?.$id;
            if (!docId) throw new Error("Metadata document not found");

            // Update metadata document
            await databases.updateDocument(databaseId, collectionId, docId, {
                onboardingCompleted: true,
                purpose,
            });

            router.push("/dashboard");
        } catch (err) {
            console.error("Failed to update user metadata:", err);
        }
    };

    return (
        <ProtectedRoute>
            <main className="h-screen p-3.5 flex flex-col">
                <div>
                    <Logo color="text-black" />
                </div>
                <div className="mt-14 w-full">
                    <h1 className="text-center text-3xl">Welcome to Cloudly, {username}</h1>
                    <p className="text-center mt-2 text-black/50">
                        What do you think you'll mostly use cloudly for?
                    </p>

                    <div className="w-[80%] flex mt-10 m-auto gap-10">
                        {OnboardingCardData.map((cardData) => {
                            const isSelected = selectedCard === cardData.CardHeading;
                            return (
                                <Card
                                    key={cardData.CardHeading}
                                    className={`flex flex-col justify-between w-[340px] px-3 cursor-pointer transition-all duration-200 ${isSelected ? "border-2 border-blue-600" : "border"}`}
                                    onClick={() => handleCardClick(cardData.CardHeading)}
                                >
                                    <h1 className="text-center text-xl font-medium mt-4">{cardData.CardHeading}</h1>
                                    <Image
                                        src={cardData.CardImage}
                                        alt={`${cardData.CardHeading} image`}
                                        unoptimized
                                        height={cardData.Dimension[0]}
                                        width={cardData.Dimension[1]}
                                        className="m-auto"
                                    />
                                    <p className="text-center text-sm mt-3 px-2">
                                        {cardData.CardDescription}
                                    </p>
                                </Card>
                            );
                        })}
                    </div>
                </div>
            </main>
        </ProtectedRoute>
    );
}
