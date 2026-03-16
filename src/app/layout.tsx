import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/providers/ConvexProviderWithClerk";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chathatke.tech"),
  title: {
    default: "chatHatke - Chat Differently",
    template: "%s | chatHatke",
  },
  description:
    "chatHatke is a real-time messaging platform to stay connected with friends, family, and colleagues. Enjoy private conversations, and a secure friend network.",
  keywords: [
    "chatHatke",
    "chathatke website",
    "chat hatke",
    "chatting with friends",
    "chat app",
    "messaging app",
    "real time chat",
    "private chatting",
  ],
  authors: [{ name: "chatHatke", url: "https://chathatke.tech" }],
  creator: "chatHatke",
  publisher: "chatHatke",
  alternates: {
    canonical: "https://chathatke.tech",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/app_logo.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chathatke.tech",
    siteName: "chatHatke",
    title: "chatHatke - Chat Differently",
    description:
      "Stay connected with friends, family, and colleagues. Group chats, private messaging, and a secure friend network — all in one place.",
    images: [
      {
        url: "/app_logo.png",
        width: 512,
        height: 512,
        alt: "chatHatke App Logo",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@chatHatke",
    creator: "@chatHatke",
    title: "chatHatke - Chat Differently",
    description:
      "Stay connected with friends, family, and colleagues. Group chats, private messaging, and a secure friend network — all in one place.",
    images: ["/app_logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
