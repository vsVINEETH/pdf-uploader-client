"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import LogoutButton from "./LogoutButton";
import { useAtom } from 'jotai';
import { userAtom } from '@/store/userAtom';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [user] = useAtom(userAtom);

  return (
    <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 text-white shadow-md transition-all z-50">
    <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo / Brand */}
        <div
        className="text-2xl font-bold tracking-wide cursor-pointer"
        onClick={() => router.push("/")}
        >
        PDF-uploader
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex space-x-4 items-center">
       {!user?.userId ? <LogoutButton /> : ''}
        </nav>

        {/* Mobile Menu Button */}
        <button
        className="md:hidden text-white"
        onClick={() => setIsOpen(!isOpen)}
        >
        {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
    </div>

    {/* Mobile Menu */}
    {isOpen && (
        <div className="md:hidden bg-white text-indigo-700 shadow-md px-4 pb-4">
        <div className="flex flex-col gap-3">
            <LogoutButton />
            <button
            onClick={() => {
                setIsOpen(false);
                router.push("/login");
            }}
            className="px-4 py-2 rounded-lg bg-indigo-100 hover:bg-indigo-200 transition"
            >
            Login
            </button>
        </div>
        </div>
    )}
    </header>
  );
}
