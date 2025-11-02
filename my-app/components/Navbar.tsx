import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'
import { Button } from './ui/ethereal-beams-hero'
import { ArrowRight } from 'lucide-react'

export default function Navbar() {
  return (
    <nav className="relative z-20 w-full">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Brand Name Only */}
            <div className="flex items-center">
              <span className="text-xl font-bold text-white">Mysh UI</span>
            </div>

            {/* Glassmorphic Navigation Pills */}
            <div className="hidden md:flex items-center space-x-1 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 p-1 -mr-6">
              <Link
                href="/"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                Home
              </Link>
              <Link
                href="games"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                Games
              </Link>
              <Link
                href="about"
                className="rounded-full px-4 py-2 text-sm font-medium text-white/90 transition-all hover:bg-white/10 hover:text-white"
              >
                About
              </Link>
            </div>

            {/* CTA Button */}
            <div className="flex items-center space-x-4">
              
              
              <SignedOut>
                <SignInButton>
                  <Button variant="ghost" size="sm" className="hidden sm:flex cursor-pointer">
                    Signin
                </Button>
                </SignInButton>
                <SignUpButton>
                  <Button size="sm" className="cursor-pointer">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
                </SignUpButton>
              </SignedOut>

              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </nav>
  )
}
