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