import { dietFormat, healthFormat } from "./urlFormat";
export async function searchRecipes(ingredientInput = "", mealType = "", dietLabels?:string[], healthLabels?:string[]): Promise<any> {
    const edamamID = "e1a01707";
    const appKey = "11c9ef351bc78989bf4b9080c390c2e7";

    const mealTypes = ["breakfast", "brunch", "lunch","dinner", "snack", "teatime"];
    const randomMealType = mealType || mealTypes[Math.floor(Math.random() * mealTypes.length)];
    console.log("Mealtype: %s", randomMealType);
    
    const apiUrl = `https://api.edamam.com/api/recipes/v2?type=public&q=${encodeURIComponent(ingredientInput)}&app_id=${edamamID}&app_key=${appKey}${dietFormat(dietLabels)}${healthFormat(healthLabels)}&mealType=${encodeURIComponent(randomMealType)}`;

    console.log("API URL:", apiUrl); // Log the final URL to inspect any issues

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data.hits;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return [];
    }
}

//get recipe by ID function
export async function fetchRecipeByID(recipeID :string): Promise<any> {
    const edamamID = "e1a01707";
    const appKey = "11c9ef351bc78989bf4b9080c390c2e7";

    const apiURL = `https://api.edamam.com/api/recipes/v2/${recipeID}?type=public&app_id=${edamamID}&app_key=${appKey}`;
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        return data.recipe;
    } catch (error) {
        console.error("Error fetching recipes:", error);
        return {};
    }
}