"use client";
import { useRouter } from "next/navigation";
import { RecipeResult } from "@/types/RecipeResponseType";
import styles from "@/app/styles.module.css";
import { useUser } from "@clerk/nextjs";
import { useCallback, useState } from "react";
import Button from "../Button/Button";
import { deleteRecipe } from "@/utils/deleteRecipe";

const RecipeCard = ({
    recipe,
    saveable,
    planable,
    deletable,
    onDelete,
}: {
    recipe: RecipeResult | Partial<RecipeResult>;
    saveable?: boolean;
    planable?: boolean;
    deletable?: boolean;
    onDelete?: (id: string) => void;
}) => {
    const [showVideo, setShowVideo] = useState(false); //video visibility toggle
    const [videoId, setVideoId] = useState<string | null>(null); //youtube video id
    const [loadingVideo, setLoadingVideo] = useState<boolean>(false);
    const { user } = useUser();
    const router = useRouter();
    const recipeId = recipe.uri?.split("recipe_")[1];

    const viewRecipeDetails = () => {
        router.push(`/recipeDetails/${recipeId}`);
    };

    const saveRecipe = useCallback(
        async (recipe: RecipeResult | Partial<RecipeResult>) => {
            try {
                let isPrivate = false; // Default to public

                while (true) {
                    const message = prompt(
                        "Would you like the recipe to be private or public? \nType in private or public"
                    );

                    if (message === null) {
                        alert("Recipe saving canceled");
                        return;
                    } else if (message.toLowerCase() === "public") {
                        isPrivate = false;
                        break;
                    } else if (message.toLowerCase() === "private") {
                        isPrivate = true;
                        break;
                    } else {
                        alert('Please enter either "public" or "private"');
                    }
                }
                const response = await fetch("/api/saveRecipe", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ recipe, isPrivate }),
                });
                const result = await response.json();
                if (response.ok) {
                    alert("Recipe saved successfully!");
                } else {
                    alert("Failed to save recipe");
                    console.error(result);
                }
            } catch (error) {
                console.error("Error saving recipe:", error);
            }
        },
        []
    );

    const addToMealPlan = useCallback(
        async (recipe: RecipeResult | Partial<RecipeResult>) => {
            if (!user?.id) {
                alert("You must be logged in to add to the meal planner!");
                return;
            }

            const date = prompt("Enter the date for this recipe (YYYY-MM-DD):");
            if (!date) {
                alert("Adding to meal plan canceled");
                return;
            }

            try {
                const response = await fetch("/api/mealPlans", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        recipeId,
                        recipeName: recipe.label,
                        date: new Date(date).toISOString(),
                        userId: user.id,
                        image: recipe.image,
                        source: recipe?.link || "NO LINK 🥲",
                    }),
                });

                if (!response.ok) throw new Error("Failed to add recipe");

                alert("Recipe added to meal plan!");
            } catch (error) {
                console.error(error);
                alert("Error adding recipe to meal plan.");
            }
        },
        []
    );

    const handleDelete = () => {
        if (recipe.link && onDelete) {
            onDelete(recipe.link);
        } else {
            console.error("Recipe link is undefined or onDelete not provided");
        }
    };


    return (
        <div className={styles.recipeCard}>
            <img src={recipe.image} alt={recipe.label} />
            <h3>{recipe.label || recipe.title}</h3>
            <div
                style={{ display: "flex", flexDirection: "column", gap: "2px" }}
            >
                <Button text="View Recipe" onClick={viewRecipeDetails} />

                {saveable && (
                    <Button
                        onClick={() => saveRecipe(recipe)}
                        text="Save Recipe"
                    />
                )}
                {planable && (
                    <Button
                        text={"Add to Meal Planner"}
                        onClick={() => addToMealPlan(recipe)}
                    />
                )}
                {deletable && (
                    <Button
                        text="❌ Remove"
                        onClick={handleDelete}
                        style={{ backgroundColor: "red", color: "white" }}
                    />
                )}
            </div>
        </div>
    );
};

export default RecipeCard;
