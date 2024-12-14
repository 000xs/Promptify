import Link from "next/link";

import { Music2, Sparkles, Globe2, Clock, ArrowRight } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-emerald-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Music2 className="h-6 w-6 text-emerald-500" />
            <span className="text-xl font-bold text-emerald-800">
              Promptify
            </span>
          </Link>
          <nav className="flex items-center space-x-4">
            <Link href="/create">
              <button>Create</button>
            </Link>
            <Link href="/pricing">
              <button>Pricing</button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-emerald-800 mb-12">
          How Promptify Works
        </h1>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="px-4 py-8 bg-white border border-gray-200 rounded-lg">
            <div>
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 text-emerald-500 mr-2" />
                Describe Your Mood
              </div>
            </div>
            <div>
              <p className="px-4 py-2">
                Tell us how you&apos;re feeling or what kind of atmosphere you want
                to create. Our AI understands natural language and emotions.
              </p>
            </div>
          </div>

          <div className="px-4 py-8 bg-white border border-gray-200 rounded-lg">
            <div>
              <div className="flex items-center">
                <Globe2 className="h-6 w-6 text-emerald-500 mr-2" />
                Choose Your Language
              </div>
            </div>
            <div>
              <p className="px-4 py-2">
                Select your preferred language for the playlist. We support
                multiple languages to cater to diverse musical tastes.
              </p>
            </div>
          </div>

          <div className="px-4 py-8 bg-white border border-gray-200 rounded-lg">
            <div>
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-emerald-500 mr-2" />
                Set Playlist Length
              </div>
            </div>
            <div>
              <p className="px-4 py-2">
                Decide how many songs you want in your playlist. Whether it&apos;s
                for a quick workout or an all-night party, we&apos;ve got you
                covered.
              </p>
            </div>
          </div>

          <div className="px-4 py-8 bg-white border border-gray-200 rounded-lg">
            <div>
              <div className="flex items-center">
                <Sparkles className="h-6 w-6 text-emerald-500 mr-2" />
                AI Generation
              </div>
            </div>
            <div>
              <p className="px-4 py-2">
                Our advanced AI algorithms analyze your input and search through
                millions of songs to create the perfect playlist for you.
              </p>
            </div>
          </div>

          <div className="px-4 py-8 bg-white border border-gray-200 rounded-lg">
            <div>
              <div className="flex items-center">
                <Music2 className="h-6 w-6 text-emerald-500 mr-2" />
                Playlist Creation
              </div>
            </div>
            <div>
              <p className="px-4 py-2">
                We compile a unique playlist tailored to your mood, language
                preference, and desired length, ensuring a personalized music
                experience.
              </p>
            </div>
          </div>

          <div className="px-4 py-8 bg-white border border-gray-200 rounded-lg">
            <div>
              <div className="flex items-center">
                <ArrowRight className="h-6 w-6 text-emerald-500 mr-2" />
                Enjoy and Share
              </div>
            </div>
            <div>
              <p className="px-4 py-2">
                Listen to your custom playlist, save it for later, or share it
                with friends. Your perfect soundtrack is just a few clicks away!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Link href="/create">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-4  px-8">
              Create Your Playlist Now
            </button>
          </Link>
        </div>
      </main>

      <footer className="bg-emerald-500 text-white mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center">
            <p>
              &copy; {new Date().getFullYear()} Promptify. All rights reserved.
            </p>
            <nav className="space-x-4">
              <Link href="/terms" className="hover:underline">
                Terms
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </footer>
    </main>
  );
}
