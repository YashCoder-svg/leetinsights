"use client";

import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.015)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative text-center max-w-md mx-auto space-y-6">
        <h1 className="text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-orange-400 to-orange-600">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-100">Algorithmic Boundary Exceeded</h2>
          <p className="text-xs text-zinc-450 leading-relaxed">
            The coordinate path you queried does not map to any active routes. Verify parameters and traverse back.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-lg bg-orange-500 hover:bg-orange-600 px-5 py-2.5 text-xs font-bold text-white transition-all active:scale-95 shadow-lg shadow-orange-500/15"
          >
            <MoveLeft className="h-4 w-4" />
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
