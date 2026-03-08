import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/ConvexProviderWithClerk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "chatHatke - Chat differently",
  description:
    "Real-time private messaging with a twist. Talk to anyone, anywhere.",
  icons: {
    apple: "/app_logo.png",
  },
  openGraph: {
    title: "chatHatke",
    description: "Real-time private messaging with a twist.",
    images: ["/app_logo.png"],
  },
  twitter: {
    card: "summary",
    title: "chatHatke",
    description: "Connect with anyone, anywhere",
  },
};

import PresenceTracker from "@/components/PresenceTracker";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          signInUrl="/"
          signUpUrl="/"
          signInFallbackRedirectUrl="/chat"
          signUpFallbackRedirectUrl="/chat"
        >
          <ConvexClientProvider>
            <Toaster position="bottom-right" richColors theme="dark" />
            <PresenceTracker />
            {children}
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
