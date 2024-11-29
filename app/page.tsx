"use client";

import Navigationbar from "@/components/Navigationbar";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { Fragment } from "react";
import { ArrowRight, Music2, Sparkles, Globe2, Clock } from 'lucide-react'
import Link from "next/link"
import { Footer } from "@/components/footer";
import { Loading } from "@/components/Loading";

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  return (
    <Fragment>
      <div className="flex min-h-screen flex-col">
        {/* //Navigationbar */}
        <Navigationbar />
        <main className="flex-1">
          <section className="w-full py-12 md:py-24 lg:py-32 bg-emerald-500">
            <div className="container px-4 md:px-6">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-white sm:text-4xl md:text-5xl lg:text-6xl">
                    Create Perfect Playlists with AI
                  </h1>
                  <p className="mx-auto max-w-[700px] text-white/90 md:text-xl">
                    Transform your mood into music. Generate personalized
                    Spotify playlists powered by artificial intelligence.
                  </p>
                </div>
                <Link href="/create">
                  <button
                    
                    className="bg-white text-emerald-500 inline-flex hover:bg-white/90 rounded-md px-4 py-2.5 font-medium  hover:text-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 lg:py-32">
            <div className="container px-4 md:px-6">
              <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Sparkles className="h-12 w-12 text-emerald-500" />
                  <h3 className="text-xl font-bold">AI-Powered</h3>
                  <p className="text-muted-foreground">
                    Advanced algorithms understand your mood and music
                    preferences
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Globe2 className="h-12 w-12 text-emerald-500" />
                  <h3 className="text-xl font-bold">Multiple Languages</h3>
                  <p className="text-muted-foreground">
                    Support for various languages and regional music preferences
                  </p>
                </div>
                <div className="flex flex-col items-center space-y-4 text-center">
                  <Clock className="h-12 w-12 text-emerald-500" />
                  <h3 className="text-xl font-bold">Custom Duration</h3>
                  <p className="text-muted-foreground">
                    Choose the perfect playlist length for any occasion
                  </p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <Footer />
        {/* herosection */}
      </div>
    </Fragment>
  );
}
