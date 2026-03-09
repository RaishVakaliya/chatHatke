"use client";

import { useEffect } from "react";
import { SignInButton, useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Users, Lock, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

export default function LandingPage() {
  const { isSignedIn, isLoaded } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.replace("/chat");
    }
  }, [isLoaded, isSignedIn, router]);

  const handleGetStarted = () => {
    if (!isLoaded) return;
    router.push("/chat");
  };

  const handleRegister = () => {
    if (!isLoaded) return;
    router.push("/chat");
  };

  if (isLoaded && isSignedIn) return null;

  return (
    <div className="min-h-screen bg-zinc-950 text-white relative overflow-hidden">
      {/* Background: dotted grid + glowing orbs */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(113 113 122) 1px, transparent 0)`,
          backgroundSize: "32px 32px",
        }}
      />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-blue-500/15 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {/* Hero Section */}
        <section className="text-center mb-24">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Connect with anyone, anywhere
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto mb-10">
            chatHatke makes it easy to stay connected with friends, family, and
            colleagues. Send messages and chat in real-time, all in one place.
          </p>
          {isSignedIn ? (
            <Button
              onClick={handleGetStarted}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Get Started
              <ArrowRight className="w-5 h-5" />
            </Button>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl="/chat">
              <Button className="inline-flex items-center gap-2 px-8 py-4 bg-white text-zinc-900 font-semibold rounded-lg hover:bg-zinc-100 transition-colors">
                Get Started
                <ArrowRight className="w-5 h-5" />
              </Button>
            </SignInButton>
          )}
        </section>

        {/* Features Section */}
        <section className="mb-24">
          <div className="flex justify-center mb-4">
            <span className="px-4 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300 text-sm font-medium">
              Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
            Everything you need to stay connected
          </h2>
          <p className="text-zinc-400 text-center max-w-2xl mx-auto mb-16">
            chatHatke combines the best features of messaging apps to make
            communication easier and more enjoyable.
          </p>

          <div className="grid md:grid-cols-2 gap-12 max-w-2xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-xl bg-zinc-800/80 flex items-center justify-center mb-4">
                <Users className="w-7 h-7 text-zinc-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Friend Network</h3>
              <p className="text-zinc-400 text-sm">
                Manage connections effortlessly.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-xl bg-zinc-800/80 flex items-center justify-center mb-4">
                <Lock className="w-7 h-7 text-zinc-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Messaging</h3>
              <p className="text-zinc-400 text-sm">
                Enjoy encrypted conversations.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center mb-20">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to get started?
          </h2>
          <p className="text-zinc-400 max-w-xl mx-auto mb-8">
            Join chatHatke today and enjoy better, real-time communication.
          </p>
          {isSignedIn ? (
            <Button
              onClick={handleRegister}
              className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
            >
              Register
            </Button>
          ) : (
            <SignInButton mode="modal" forceRedirectUrl="/chat">
              <Button className="px-8 py-4 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors">
                Register
              </Button>
            </SignInButton>
          )}
        </section>

        {/* Footer */}
        <footer className="text-center text-zinc-500 text-sm">
          © {new Date().getFullYear()} chatHatke. All rights reserved.
        </footer>
      </div>
    </div>
  );
}
