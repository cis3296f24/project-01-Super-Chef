import { getAuth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { connect } from '@/libs/db';  // Make sure your db connection file is correct
import User from '@/libs/models/user.model';
import SavedRecipe from "@/libs/models/savedRecipe.model";

export async function GET(req: NextRequest) {
    try {
        const { userId } = getAuth(req); // Get the logged-in user's ID from Clerk

        if (!userId) {
            return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
        }
        const { searchParams } = new URL(req.url);
        const profileId = searchParams.get("profileId");
        console.log(profileId)
        await connect();  // Connect to the database

        // Fetch the user profile from MongoDB based on userId (chefID or userId)
        const user = await User.findOne({ chefID: profileId }).exec();
        const savedRecipes = await SavedRecipe.find({ userId:profileId, isPrivate:false });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        if(!savedRecipes){
            console.log("user has no public saved recipes!")
        }

        return NextResponse.json({user,savedRecipes}, {status:200});
    } catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ error: 'Failed to fetch user profile' }, { status: 500 });
    }
}
