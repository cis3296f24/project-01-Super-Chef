export async function deleteRecipe(endpoint: string, id: string): Promise<boolean> {
    try {
        const response = await fetch(`${endpoint}/${id}`, { method: "DELETE" });
        if (!response.ok) {
            console.error(`Failed to delete recipe: ${response.statusText}`);
            return false;
        }
        return true;
    } catch (error) {
        console.error(`Error deleting recipe: ${error}`);
        return false;
    }
}
