import { Button } from '@/components/ui/button';
import ModeToggle from '@/components/ui/mode-toggle'; // Assuming this component handles the actual theme switching logic
import { UserRole } from '@/generated/client';
import { SignedOut, SignInButton, SignedIn, UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

function Navbar({ userRole }) {
  return (
    // 1. Outer Container: Centers the nav and gives it the "floating" look
    <div className="fixed top-0 left-0 right-0 flex justify-center pt-4 z-50">
      
      <nav className="w-[95%] max-w-6xl bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-[#333] rounded-full px-6 h-14 flex items-center justify-between shadow-lg transition-colors duration-300">
        
        {/* Left Side: Logo */}
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
           <Image src="/logo.svg" alt="CodeYodha Logo" width={24} height={24} />
           <span className="text-lg font-bold text-gray-900 dark:text-gray-200 tracking-wide">
               CodeYodha
           </span>
        </Link>

        {/* Center: Navigation Links */}
        <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-600 dark:text-gray-400">
            <Link href="/problems" className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">Problems</Link>
            <Link href="/about" className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">About</Link>
            <Link href="/profile" className="hover:text-black dark:hover:text-white transition-colors cursor-pointer">Profile</Link>
            {userRole === "ADMIN" && (
                <Link href="/admin" className="text-orange-600 dark:text-orange-400 hover:text-orange-500 dark:hover:text-orange-300 transition-colors cursor-pointer">
                    Admin Panel
                </Link>
            )}
        </div>

        {/* Right Side: Actions (Theme & User) */}
        <div className="flex items-center gap-4">
            <ModeToggle />
            <SignedIn>
                {userRole && userRole === UserRole.ADMIN && (
                    <Link href={"/create-problem"}>
                        <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
                            Create Problem
                        </Button>
                    </Link>
                )}
                <UserButton/>
            </SignedIn>

            <SignedOut>
                <div className='flex items-center gap-2'>
                    <SignInButton mode="modal">
                        <Button variant="ghost" size="sm" className="text-gray-700 dark:text-gray-300">
                            Sign In
                        </Button>
                    </SignInButton>

                    <Link href="/sign-up">
                        <Button size="sm">Sign Up</Button>
                    </Link>
                </div>
            </SignedOut>
        </div>

      </nav>
    </div>
  )
}

export default Navbar