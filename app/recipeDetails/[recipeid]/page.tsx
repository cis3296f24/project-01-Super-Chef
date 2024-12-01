"use client";
import { RecipeResult } from '@/types/RecipeResponseType';
import { fetchRecipeByID } from '@/utils/fetchRecipes';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

declare global{
    interface Window {
        YT: any;
        onYouTubeIframeAPIReady: () => void;
    }
}

export default function RecipeDetails() {
    const [recipe, setRecipe] = useState<RecipeResult>()
    const [loading, setLoading] = useState(true)
    const router = useRouter();
    const recipeId = useParams().recipeid as string
    const [videoId, setVideoId] = useState<string | null>(null);//yt video ID
    const [playerReady, setPlayerReady] = useState<boolean>(false);//tracks if yt api is ready
    const playerRef = useRef<HTMLDivElement | null>(null);
    const [videoDetails, setVideoDetails] = useState<any>(null);


    console.log(recipeId)

    useEffect(() => {
        //fetch recipe details
        const fetchRecipeDetails = async()=>{
            const recipeResult = await fetchRecipeByID(recipeId);
            setRecipe(recipeResult);
            setLoading(false);
        };
        fetchRecipeDetails();
    }, [recipeId]);

    useEffect(() => {
        if (!window.YT || !window.YT.Player) {
            const script = document.createElement('script');
            script.src = 'https://www.youtube.com/iframe_api';
            script.async = true;
            document.body.appendChild(script);

            script.onload = () => setPlayerReady(true);
        } else {
            setPlayerReady(true);
        }
    }, []);

    useEffect(() => {
        if (recipe) {
            fetchVideo();
        }
    }, [recipe]);


    const fetchVideo = async () => {
        if (!recipe || !recipe.label) return;

        const query = `${recipe.label} recipe`.trim();
        const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=1&q=${encodeURIComponent(
            query
        )}&key=${apiKey}`;

        try {
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Line 73) YouTube API Error:", errorData, "Status Code:", response.status);
                return;
            }

            const data = await response.json();
            console.log("YouTube API Response:", data);

            if (data.items && data.items.length > 0) {
                const fetchedVideoId = data.items[0].id.videoId;
                console.log("Fetched video ID:", fetchedVideoId);
                setVideoId(fetchedVideoId);

                // Fetch additional details
                //fetchVideoDetails(fetchedVideoId);
            } else {
                console.warn("No video found for query:", query);
                setVideoId(null);
            }
        } catch (error) {
            console.error("Error fetching YouTube video:", error);
        }
    };
    const playVideo = () => {
        if (!playerRef.current || !videoId || !playerReady) return;

        //dynamically make the yt player
        new window.YT.Player(playerRef.current, {
            height: '390',
            width: '640',
            videoId: videoId,
            playerVars: {
                playsinline: 1,
            },
            events: {
                onReady: (event: any) => {
                    event.target.playVideo();
                },
            },
        });
    };

    useEffect(() => {
        if (videoId){
            playVideo();
        }
    }, [videoId, playerReady]);

    console.log(recipe)
    if (loading) return <div>RECIPE IS LOADING!!</div>;
    if (!recipe) return <div>No recipe Found</div>;

    return (
        <div style={{ color: "black", fontSize: "20px", padding: "20px" }}>
            <img src={recipe.image} alt="Recipe" style={{ maxWidth: "100%", borderRadius: "8px" }} />
            <h1>{recipe.label}</h1>
            <h2>Ingredients</h2>
            <ul>
                {recipe.ingredientLines.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
                ))}
            </ul>
            <h2>Source</h2>
            <a href={recipe.url} target="_blank" rel="noopener noreferrer" style={{ color: "blue", textDecoration: "underline" }}>
                View Full Recipe on {recipe.source}
            </a>

            {videoId && (
                <div style={{ marginTop: "20px" }}>
                    <h2>Recipe Video</h2>
                    <div ref={playerRef}></div>
                </div>
            )}
        </div>
    );
}

