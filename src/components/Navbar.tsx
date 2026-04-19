"use client";

import Link from "next/link";
import { LoginButton } from "./LoginButton";
import { useAuth } from "@/hooks/useAuth";

export function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="w-full bg-gray-900 border-b border-gray-800 text-white p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-500 bg-clip-text text-transparent">
          ClyraWeb
        </Link>
        
        <div className="flex items-center gap-6">
          {user && (
            <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
          )}
          <LoginButton />
        </div>
      </div>
    </nav>
  );
}
