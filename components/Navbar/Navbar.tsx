"use client";

import React, { useState } from "react";
import {
    SignedIn,
    SignedOut,
    useUser,
    UserButton,
    SignInButton,
} from "@clerk/nextjs";
import styles from "./navbar.module.css";
import Link from "next/link";

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const { user } = useUser();

    const toggleMenu = () => setMenuOpen(!menuOpen);
    const toggleSettings = () => setSettingsOpen(!settingsOpen);

    return (
        <header className={styles.navbar}>
            {/* Left: Toggle button and logo */}
            <div className={styles.leftSection}>
                <button
                    className={styles.hamburger}
                    onMouseEnter={() => setMenuOpen(true)}
                    onMouseLeave={() => setMenuOpen(false)}
                >
                    Menu
                    {menuOpen && (
                        <div
                            className={styles.dropdownMenu}
                            style={{ left: "1rem" }}
                        >
                            <Link href="/savedRecipes">Saved Recipes</Link>
                            <Link href="/chefTools">Chef Tools</Link>
                            {user && (
                                <Link href={`/profile/${user.id}`}>
                                    Profile
                                </Link>
                            )}
                            <Link href="/eventPage">Events</Link>
                            <Link href="/mealPlanner">Meal Planner</Link>
                            <Link href="/custom">Generate Recipe!</Link>
                        </div>
                    )}
                </button>
                <Link href="/" className={styles.logo}>
                    <img
                        src="/images/Logo.png"
                        alt="Super Chef Logo"
                        style={{ height: "30px" }}
                    />
                    Super-Chef
                </Link>
            </div>

            {/* Center: Welcome message */}
            <div className={styles.welcomeMessage}>
                <SignedIn>Welcome to Super-Chef, {user?.firstName}!</SignedIn>
                <SignedOut>Welcome to Super-Chef!</SignedOut>
            </div>

            {/* Right: Settings and Sign In/Sign Out Buttons */}
            <div className={styles.rightSection}>
                <button
                    className={styles.settingsButton}
                    onMouseEnter={() => setSettingsOpen(true)}
                    onMouseLeave={() => setSettingsOpen(false)}
                >
                    Settings
                    {settingsOpen && (
                        <div
                            className={styles.dropdownMenu}
                            style={{ right: "2rem" }}
                        >
                            <Link href="/account">Account Settings</Link>
                            <Link href="/preferences">Preferences</Link>
                        </div>
                    )}
                </button>
                <SignedOut>
                    <SignInButton>
                        <button className={styles.button}>Sign In</button>
                    </SignInButton>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </div>
        </header>
    );
};

export default Navbar;
