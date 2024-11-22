"use client"; // Ensure this is a client-side component

import { useCallback, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs"; // Clerk's React hook to access the authenticated user
import styles from "@/app/profile/profile.module.css";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { RecipeResult } from "@/types/RecipeResponseType";
import RecipeCard from "@/components/RecipeCard/RecipeCard";

const Profile = () => {
    const router = useRouter();
    const profileId = useParams().profileId;
    const { isLoaded, isSignedIn, user } = useUser(); // Retrieve authenticated user data from Clerk
    const [profile, setProfile] = useState<any>(null); // State to store user profile data
    const [formData, setFormData] = useState<any>({}); // State to handle form input changes
    const [isEditing, setIsEditing] = useState(false); // Track whether we're in editing mode
    const [savedRecipes, setSavedRecipes] = useState<RecipeResult[]>([]);
    const [privateView, setPrivateView] = useState(false);

    // Fetch the user profile data from the API
    useEffect(() => {
        if (user) {
            const fetchProfile = async () => {
                if (user.id === profileId) {
                    const response = await fetch("/api/userProfile");
                    if (response.ok) {
                        const data = await response.json();
                        setProfile(data);
                        setFormData(data);
                    }
                } else {
                    const response = await fetch(
                        `/api/publicProfile?profileId=${profileId}`
                    );
                    const { user, savedRecipes } = await response.json();
                    setProfile(user);
                    setSavedRecipes(savedRecipes);
                }
            };
            fetchProfile();
        }
    }, [user]);

    // Handle input changes in the form, including nested fields
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev: any) => {
            // Handle social media fields specifically
            if (name.startsWith("socialMedia.")) {
                const platform = name.split(".")[1];
                return {
                    ...prev,
                    socialMedia: {
                        ...prev.socialMedia,
                        [platform]: value,
                    },
                };
            }
            return { ...prev, [name]: value };
        });
    };

    const replaceImage = () => {
        alert("Image replace coming soon");
        //user?.setProfileImage({file:{upload file}})
    };

    // Handle form submission to update the user profile
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await fetch("/api/userProfile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const updatedUser = await response.json();
            setProfile(updatedUser); // Update profile with the latest data
            setIsEditing(false); // Exit edit mode
            alert("Profile updated successfully!");
        } else {
            alert("Failed to update profile.");
        }
    };

    // Function to fetch saved recipes
    useEffect(() => {
        const effect = async () => {
            if (user?.id !== profileId) {
                return;
            }
            try {
                const response = await fetch("/api/getSavedRecipes");
                if (response.ok) {
                    const recipes = await response.json();

                    setSavedRecipes(recipes);
                } else {
                    console.error("Failed to fetch saved recipes");
                }
            } catch (error) {
                console.error("Error fetching saved recipes:", error);
            }
        };
        effect();
    }, []);

    // Show loading state while fetching user data
    if (!user) {
        return null;
    }
    if (!profile) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <div
                onClick={() => replaceImage()}
                style={{ height: "18rem", width: "18rem" }}
            >
                <img
                    alt={"profileImage"}
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                    }}
                    src={user.imageUrl}
                />
            </div>
            <h1 className={styles.name}>{user.username}</h1>
            <p className={styles.bio}>{profile.bio}</p>
            <div
                style={{
                    height: "1.8rem",
                    width: "9rem",
                    display: "flex",
                    justifyContent: "space-between",
                }}
            >
                <img
                    className={styles.socialMediaIcon}
                    src="/images/facebook.png"
                    width={28}
                    alt="FB"
                    onClick={() => {
                        router.push(profile.socialMedia.facebook);
                    }}
                />{" "}
                <img
                    className={styles.socialMediaIcon}
                    src="/images/yelp.png"
                    alt="FB"
                    width={30}
                />
                <img
                    className={styles.socialMediaIcon}
                    src="/images/instagram.png"
                    alt="FB"
                    width={30}
                />
            </div>
            {user.id === profileId && (
                <div>
                    <button onClick={() => setPrivateView(!privateView)}>
                        View Private Recipes
                    </button>
                </div>
            )}
            <div className={styles.recipes}>
                {savedRecipes
                    .filter(recipe =>
                        privateView ? recipe.isPrivate : !recipe.isPrivate
                    )
                    .map((recipe, key) => {
                        return (
                            <RecipeCard key={key} recipe={recipe} planable />
                        );
                    })}
            </div>
        </div>
    );
};

export default Profile;
