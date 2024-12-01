"use client";
import React, { useState, useCallback } from "react";
import styles from "./searchbar.module.css";
import Button from "../Button/Button";

interface SearchProps {
    onSubmitSearch: (
        ingredients?: string,
        diet?: string[],
        health?: string[]
    ) => void;
}
/**
 * @todo filtering the recipes upon applying a filter is makign it slow, might be better if it waits till applying?
 * set logic also doesn't need to be this complex i think...
 */
export default function Search({ onSubmitSearch }: SearchProps) {
    const [ingredients, setIngredients] = useState("");
    const [dietModalVisible, setDietModalVisible] = useState(false);
    const [healthModalVisible, setHealthModalVisible] = useState(false);
    const [activeDiet, setActiveDiet] = useState(new Set<string>());
    const [activeHealth, setActiveHealth] = useState(new Set<string>());
    const [advancedSearch, setAdvancedSearch] = useState(false);

    const dietLabels = [
        "balanced",
        "high-fiber",
        "high-protein",
        "low-carb",
        "low-fat",
        "low-sodium",
    ];
    const healthLabels = [
        "Sugar-Conscious",
        "Low Potassium",
        "Kidney-Friendly",
        "Keto-Friendly",
        "Vegetarian",
        "Pescatarian",
        "Paleo",
        "Mediterranean",
        "Dairy-Free",
        "Gluten-Free",
        "Wheat-Free",
        "Peanut-Free",
        "Tree-Nut-Free",
        "Soy-Free",
        "Fish-Free",
        "Shellfish-Free",
        "Pork-Free",
        "Red-Meat-Free",
        "Crustacean-Free",
        "Celery-Free",
        "Mustard-Free",
        "Sesame-Free",
        "Lupine-Free",
        "Mollusk-Free",
        "Alcohol-Free",
        "No oil added",
        "Sulfite-Free",
        "FODMAP-Free",
        "Kosher",
    ];

    const toggleFilter = (filter: string, filterType: "diet" | "health") => {
        if (filterType === "diet") {
            setActiveDiet(prevFilters => {
                const newFilters = new Set(prevFilters);
                if (newFilters.has(filter)) {
                    newFilters.delete(filter);
                    console.log("Removed %s", filter);
                } else {
                    newFilters.add(filter);
                    console.log("Added %s", filter);
                }

                return newFilters;
            });
        } else if (filterType === "health") {
            setActiveHealth(prevFilters => {
                const newFilters = new Set(prevFilters);
                if (newFilters.has(filter)) {
                    newFilters.delete(filter);
                    console.log("Removed %s", filter);
                } else {
                    newFilters.add(filter);
                    console.log("Added %s", filter);
                }

                return newFilters;
            });
        }
    };
    const applyFilters = (type: string) => {
        if (type == "diet") {
            setDietModalVisible(false);
        } else if (type == "health") {
            setHealthModalVisible(false);
        }
        onSubmitSearch(
            ingredients,
            Array.from(activeDiet),
            Array.from(activeHealth)
        );
    };
    const clearFilters = (type: string) => {
        if (type == "diet") {
            setActiveDiet(new Set<string>());
            setDietModalVisible(false);
        } else if (type == "health") {
            setActiveHealth(new Set<string>());
            setHealthModalVisible(false);
        }
        onSubmitSearch(
            ingredients,
            Array.from(activeDiet),
            Array.from(activeHealth)
        );
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            onSubmitSearch(ingredients, Array.from(activeDiet), Array.from(activeHealth));
        }
    };


    return (
        <div className={styles.search}>
            <div style={{ width: "100%", display: "flex", gap: "10px" }}>
                <input
                    onChange={e => setIngredients(e.target.value)}
                    onKeyDown={handleKeyPress}//for enter
                    className={styles.input}
                    type="text"
                    id="ingredient"
                    placeholder="Enter ingredients (comma-separated)"
                />
                <Button
                    text="Search"
                    onClick={() =>
                        onSubmitSearch(
                            ingredients,
                            Array.from(activeDiet),
                            Array.from(activeHealth)
                        )
                    }
                />
                <Button text={"Random"} onClick={() => onSubmitSearch()} />
            </div>

            {advancedSearch ? (
                <div
                    style={{
                        position: "relative",
                        width: "100%",
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <p
                        style={{
                            position: "absolute",
                            left: "1rem",
                            color: "#e36635",
                            cursor: "pointer",
                            height: "auto",
                        }}
                        onClick={() => {
                            setAdvancedSearch(false);
                        }}
                    >
                        x
                    </p>
                    <button
                        onClick={() => setDietModalVisible(true)}
                        className={styles.button}
                    >
                        Diet Type
                    </button>
                    <button
                        onClick={() => setHealthModalVisible(true)}
                        className={styles.button}
                    >
                        Health Labels
                    </button>
                </div>
            ) : (
                <span
                    onClick={() => {
                        setAdvancedSearch(true);
                    }}
                    style={{ color: "#e36635", cursor: "pointer" }}
                >
                    Advanced Search
                </span>
            )}

            {/* Diet Filter Modal */}
            {dietModalVisible && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setDietModalVisible(false)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <h3>Filter Diet Type</h3>
                        {dietLabels.map((label, index) => (
                            <label key={index} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={activeDiet.has(label)}
                                    onChange={() => toggleFilter(label, "diet")}
                                />
                                {label}
                            </label>
                        ))}
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                onClick={() => applyFilters("diet")}
                                className={styles.applyButton}
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={() => clearFilters("diet")}
                                className={styles.applyButton}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Health Filter Modal */}
            {healthModalVisible && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setHealthModalVisible(false)}
                >
                    <div
                        className={styles.modalContent}
                        onClick={e => {
                            e.stopPropagation();
                        }}
                    >
                        <h3>Filter Health Labels</h3>
                        {healthLabels.map((label, index) => (
                            <label key={index} className={styles.checkboxLabel}>
                                <input
                                    type="checkbox"
                                    checked={activeHealth.has(label)}
                                    onChange={() =>
                                        toggleFilter(label, "health")
                                    }
                                />
                                {label}
                            </label>
                        ))}
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                onClick={() => applyFilters("health")}
                                className={styles.applyButton}
                            >
                                Apply Filters
                            </button>
                            <button
                                onClick={() => clearFilters("health")}
                                className={styles.applyButton}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
