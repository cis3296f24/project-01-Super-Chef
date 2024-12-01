"use client";
import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import RecipeCard from "@/components/RecipeCard/RecipeCard";
import styles from "./mealPlanner.module.css";
import MealPlan from "@/libs/models/mealPlan.model";
import { Ingredients } from "@/types/RecipeResponseType";
import { fetchMealPlans } from "@/utils/fetchMealPlans";
import { number } from "prop-types"; // made it optional

interface MealPlan {
    recipeId: string; // Corresponds to RecipeResult.uri
    recipeName: string; // Corresponds to RecipeResult.label
    date: string;
    userId: string;
    image: string; // Corresponds to RecipeResult.image
    source: string; // Corresponds to RecipeResult.source
    url: string; // Corresponds to RecipeResult.url
    dietLabels: string[]; // Corresponds to RecipeResult.dietLabels
    healthLabels: string[]; // Corresponds to RecipeResult.healthLabels
    ingredientLines: string[]; // Corresponds to RecipeResult.ingredientLines
    ingredients: Ingredients[]; // Matches RecipeResult.ingredients
    isPrivate: boolean; // Matches RecipeResult.isPrivate
}

export default function MealPlanner() {
    const { user } = useUser();
    const userId = user?.id;

    const [selectedDate, setSelectedDate] = useState(new Date());
    const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);

    useEffect(() => {
        const fetchMealPlans = async () => {
            if (!userId) return;

            try {
                const response = await fetch(`/api/mealPlans?userId=${userId}`);
                if (response.ok) {
                    const data = await response.json();
                    setMealPlans(data);
                } else {
                    console.error("Failed to fetch meal plans.");
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchMealPlans();
    }, [userId]);

    const getMealsForDate = (date: Date | null) => {
        return mealPlans.filter(
            meal =>
                new Date(meal.date).toISOString().split("T")[0] ===
                date?.toISOString().split("T")[0]
        );
    };

    const deleteMealPlan = async (id: string) => {
        try {
            const response = await fetch(`/api/mealPlans?id=${id}`, { method: "DELETE" });
            if (response.ok) {
                setMealPlans(prev => prev.filter(meal => meal.recipeId !== id));
                alert("Meal plan deleted successfully.");
            } else {
                alert("Failed to delete meal plan.");
            }
        } catch (error) {
            console.error("Error deleting meal plan:", error);
        }
    };

    useEffect(() => {
        fetchMealPlans();
    }, []);

    const mealsForDate = mealPlans.filter(
        meal => new Date(meal.date).toDateString() === selectedDate.toDateString()
    );

    return (
        <div>
            <h1>Meal Planner</h1>
            <Calendar
                value={selectedDate}
                onChange={value => {
                    if (value instanceof Date) {
                        setSelectedDate(value);
                    } else {
                        console.warn("UnexpectedValue Type: ", value);
                    }
                }}
                className={styles.customCalendar}
            />
            <h2>Meals for {selectedDate.toDateString()}</h2>

            <div
                style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(auto-fill, minmax(220px, 1fr))",
                    gap: "20px",
                    justifyContent: "center",
                }}
            >
                {getMealsForDate(selectedDate).map((meal, index) => (
                    <RecipeCard
                        key={index}
                        recipe={{
                            title: meal.recipeName,
                            recipe: {}, // Placeholder if not used
                            ingredients: meal.ingredients,
                            uri: meal.recipeId,
                            label: meal.recipeName,
                            image: meal.image,
                            imageType: meal.image,
                            source: meal.source,
                            url: meal.url,
                            dietLabels: meal.dietLabels,
                            healthLabels: meal.healthLabels,
                            ingredientLines: meal.ingredientLines,
                            isPrivate: meal.isPrivate,
                        }}
                        saveable
                        deletable
                        onDelete={deleteMealPlan}
                    />
                ))}
            </div>
        </div>
    );
}
