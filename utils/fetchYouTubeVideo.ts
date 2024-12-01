export const fetchYouTubeVideo = async (recipeName:string) => {
    try {
        const response = await fetch(`/api/youtube?recipeName=${encodeURIComponent(recipeName)}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to fetch YouTube video.");
        }

        return data.videoId; // Return the video ID
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error fetching YouTube video:", error.message);
        } else {
            console.error("An unexpected error occurred:", error);
        }
    }
};
