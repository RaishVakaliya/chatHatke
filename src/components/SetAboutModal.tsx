"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Check, Loader2, X } from "lucide-react";
import { Artifika } from "next/font/google";
import { PRESETS } from "@/constant/preset";

const artifika = Artifika({
  subsets: ["latin"],
  weight: "400",
});

export default function SetAboutModal({
  onComplete,
  onClose,
}: {
  onComplete: () => void;
  onClose: () => void;
}) {
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);
  const updateAbout = useMutation(api.users.updateAbout);

  const handleSubmit = async (value: string) => {
    if (!value.trim()) return;
    setLoading(true);
    try {
      await updateAbout({ about: value });
      onComplete();
    } catch (error) {
      console.error("Failed to update about:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-full transition-all z-10 cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 text-center border-b border-zinc-900">
          <h2
            className={`${artifika.className} text-2xl font-bold text-white mb-2`}
          >
            Set Your Status
          </h2>
          <p className="text-zinc-400 text-sm">
            Please set an "About" status to continue. This helps others know
            what you are up to!
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
                Custom Status
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Type anything..."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit(about)}
                  maxLength={50}
                />
                <button
                  onClick={() => handleSubmit(about)}
                  disabled={loading || !about.trim()}
                  className="absolute right-2 top-2 p-1.5 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 transition-colors"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider block">
                Quick Presets
              </label>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    onClick={() => handleSubmit(p)}
                    disabled={loading}
                    className="px-4 py-2 rounded-full bg-zinc-900/50 border border-zinc-800 hover:bg-zinc-800 hover:border-zinc-700 text-sm text-zinc-300 transition-all flex items-center justify-center"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 bg-zinc-900/30 text-center">
          <p className="text-[10px] text-zinc-600">
            You can always change this later in your profile settings.
          </p>
        </div>
      </div>
    </div>
  );
}
