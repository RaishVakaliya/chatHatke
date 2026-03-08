"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen px-4 text-center transition-colors font-sans"
      style={{
        backgroundColor: "#5d5d5dff",
        color: "#1c1c1e",
      }}
    >
      <div className="relative flex flex-col items-center">
        <h1 className="text-[12rem] md:text-[18rem] font-black text-green-500/8 leading-none select-none absolute top-1/2 -translate-y-1/2 pointer-events-none">
          404
        </h1>

        <div className="relative z-10 mb-10 group">
          <Image
            src="/doggy.png"
            alt="Cute 404 Dog"
            width={400}
            height={400}
            className="relative z-10 w-64 h-64 md:w-80 md:h-80 object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)] transition-transform duration-500 select-none"
            priority
            style={{
              animation: "doggyFloat 6s ease-in-out infinite",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
            Oops! Lost your way?
          </h2>
          <p className="text-gray-900 mb-10 max-w-sm mx-auto text-lg font-medium leading-relaxed">
            Our furry friend couldn&apos;t find that page, but they can guide
            you back safely.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-3 px-10 py-4.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-zinc-900/20 group no-underline"
          >
            <MoveLeft className="w-5 h-5 transition-transform group-hover:-translate-x-2" />
            Back to Safety
          </Link>
        </div>
      </div>

      <style jsx global>{`
        @keyframes doggyFloat {
          0%,
          100% {
            transform: translateY(0px) rotate(-1deg);
          }
          50% {
            transform: translateY(-20px) rotate(1deg);
          }
        }
      `}</style>
    </div>
  );
}
