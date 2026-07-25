"use client";

import { useEffect } from "react";
import { RefreshCw } from "lucide-react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("Dashboard error boundary caught:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-red-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[300px] bg-zinc-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.015)_1px,transparent_0)] bg-[size:24px_24px] pointer-events-none" />

      <div className="relative text-center max-w-md mx-auto space-y-6">
        <h1 className="text-9xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-b from-red-400 to-red-600">
          500
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-zinc-100">System Execution Fault</h2>
          <p className="text-xs text-zinc-450 leading-relaxed">
            An unhandled runtime exception occurred during rendering. The stack tracer caught code boundary leaks.
          </p>
        </div>

        <div className="pt-4 flex justify-center">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-lg bg-red-500 hover:bg-red-600 px-5 py-2.5 text-xs font-bold text-white transition-all active:scale-95 shadow-lg shadow-red-500/15 cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Retry execution
          </button>
        </div>
      </div>
    </div>
  );
}
