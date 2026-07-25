"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/auth-provider";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-white">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center gap-4"
        >
          <div className="relative flex h-16 w-16 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-orange-500" />
            <div className="absolute inset-0 rounded-full border-2 border-orange-500/20" />
          </div>
          <p className="text-sm font-medium text-zinc-400">Loading your profile...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevents flashing dashboard content while redirecting
  }

  return <>{children}</>;
}
