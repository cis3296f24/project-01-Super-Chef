import {
    ClerkProvider,
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
} from '@clerk/nextjs';
import './globals.css';
import styles from './styles.module.css';
import Navbar from '@/components/Navbar/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en">
            <head>
                <title>SuperChef App</title>
                <meta name="description" content="Find and save your favorite recipes!" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
            </head>
            <body>
            <Navbar />
            <main>{children}</main>
            </body>
            </html>
        </ClerkProvider>
    );
}
