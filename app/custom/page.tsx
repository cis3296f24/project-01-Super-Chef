"use client";
import Button from "@/components/Button/Button";
import styles from "./openai.module.css";
import { useState } from "react";

export default function Generate() {
    const [theInput, setTheInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [responseContent, setResponseContent] = useState([""]);

    const prompt = "Give me a recipe with the ingredients below: ";

    const callGetResponse = async () => {
        setIsLoading(true);
        const userMessage = { role: "user", content: prompt + theInput };
        setTheInput("");

        try {
            const response = await fetch("/api/openai", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ messages: [userMessage] }), // Send only the user's input
            });

            const output = await response.json();

            if (output) {
                const splitOutput = output.content.split("\n");
                setResponseContent(splitOutput); // Update with the assistant's latest response
            }
        } catch (error) {
            console.error("Error fetching response:", error);
            setResponseContent([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            if (!isLoading) callGetResponse();
        }
    };

    return (
        <div className={styles.container}>
            <div>
                {
                    "Enter the ingredients of the recipe you would like to generate, or ask our A.I. to make a special dish!"
                }
            </div>
            <textarea
                style={{ width: "80%", height: "150px" }}
                value={theInput}
                onChange={e => setTheInput(e.target.value)}
                onKeyDown={handleSubmit}
                disabled={isLoading}
            />
            <Button
                style={{ width: "35%" }}
                onClick={isLoading ? callGetResponse : () => {}}
                text={isLoading ? "Loading..." : "Generate"}
            />
            {responseContent && responseContent.length && (
                <div
                    style={{
                        marginTop: "2rem",
                        display: "flex",
                        flexDirection: "column",
                        gap: "0.5rem",
                        alignItems: "flex-start",
                        paddingLeft: "1rem",
                    }}
                >
                    {responseContent?.map((recipeLine: string, index) => {
                        return <span key={index}>{recipeLine}</span>;
                    })}
                </div>
            )}
        </div>
    );
}
