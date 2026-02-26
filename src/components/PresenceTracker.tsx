"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useAuth } from "@clerk/nextjs";

export default function PresenceTracker() {
  const { isSignedIn } = useAuth();
  const updatePresence = useMutation(api.users.updatePresence);

  useEffect(() => {
    if (!isSignedIn) return;

    // Initial update
    updatePresence();

    // every 30 seconds
    const interval = setInterval(() => {
      updatePresence();
    }, 30000);

    return () => clearInterval(interval);
  }, [isSignedIn, updatePresence]);

  return null;
}
