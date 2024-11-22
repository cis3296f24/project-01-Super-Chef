"use client";
import styles from "./styles.module.css";
import React, { useCallback, useState } from "react";
import { searchRecipes } from "@/utils/fetchRecipes";
import { RecipeResult } from "@/types/RecipeResponseType";
import RecipeCard from "@/components/RecipeCard/RecipeCard";
import SearchBar from "@/components/SearchBar/SearchBar";
import { useUser } from "@clerk/nextjs";

export default function Home() {
    const [recipes, setRecipes] = useState<RecipeResult[]>([]);
    const [hasSearched, setHasSearched] = useState(false);
    const { user } = useUser();

    // Function to submit a search with ingredients
    const submitSearch = useCallback(
        async (ingredients?: string, diet?: string[], health?: string[]) => {
            setHasSearched(true);
            const recipeResult = await searchRecipes(
                ingredients,
                "",
                diet,
                health
            );
            if (recipeResult && recipeResult.length > 0) {
                const formattedRecipes = recipeResult.map((result: any) => ({
                    label: result.recipe.label,
                    image: result.recipe.image,
                    link: result.recipe.shareAs,
                    dietLabels: result.recipe.dietLabels || [],
                    healthLabels: result.recipe.healthLabels,
                    uri: result.recipe.uri || "",
                }));
                setRecipes(formattedRecipes);
            } else {
                setRecipes([]);
            }
        },
        []
    );

    // Function to fetch random recipes
    // const fetchRandomRecipes = useCallback(async () => {
    //     setHasSearched(true);
    //     const recipeResult = await searchRecipes();
    //     // recipeResult.forEach((result: any, index: number) => {
    //     //     console.log(`Recipe ${index} Diet Labels:`, result.recipe.dietLabels || "No diet labels");
    //     // });
    //     if (recipeResult && recipeResult.length > 0) {
    //         const formattedRecipes = recipeResult.map((result: any) => ({
    //             label: result.recipe.label,
    //             image: result.recipe.image,
    //             link: result.recipe.uri,
    //             dietLabels: result.recipe.dietLabels || [],
    //         }));
    //         setRecipes(formattedRecipes);
    //     } else {
    //         setRecipes([]);
    //     }
    // }, []);

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <svg viewBox="0 0 500 100" className={styles.superChefHeader}>
                    <text
                        x="50%"
                        y="50%"
                        textAnchor="middle"
                        dominantBaseline="middle"
                    >
                        SuperChef
                    </text>
                </svg>
                <SearchBar onSubmitSearch={submitSearch} />
                {/* Recipes display section */}
                <div className={styles.recipes}>
                    {hasSearched && recipes.length === 0 ? (
                        <h1>No Recipes Found</h1>
                    ) : (
                        recipes.map((recipe, key) => (
                            <RecipeCard
                                key={key}
                                recipe={recipe}
                                saveable
                                planable
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
