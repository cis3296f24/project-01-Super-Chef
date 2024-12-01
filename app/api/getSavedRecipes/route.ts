import { NextRequest, NextResponse} from "next/server";
import { connect } from '@/libs/db';
import SavedRecipe from "@/libs/models/savedRecipe.model";
import { getAuth } from '@clerk/nextjs/server';

export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req); // Retrieve the logged-in user's ID
        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }

        await connect();
        const savedRecipes = await SavedRecipe.find({ userId });
        
        return NextResponse.json(savedRecipes, {status: 200});
    } catch (error) {
        console.error('Error retrieving saved recipes:', error);
        return NextResponse.json({ error: 'Failed to retrieve saved recipes' }, { status: 500 });
    }
}


export async function DELETE(req: NextRequest) {
    await connect();

    try {
        const { userId } = getAuth(req); // Retrieve the logged-in user's ID
        if (!userId) {
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");

        if (!id) {
            return NextResponse.json({ error: "Recipe ID is required" }, { status: 400 });
        }

        const deletedRecipe = await SavedRecipe.findOneAndDelete({ userId, link: id });
        if (!deletedRecipe) {
            return NextResponse.json({ error: "Saved recipe not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Saved recipe deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting saved recipe:", error);
        return NextResponse.json({ error: "Failed to delete saved recipe" }, { status: 500 });
    }
}

