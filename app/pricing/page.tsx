import Link from "next/link";
 
import { Music2, Check } from "lucide-react";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-emerald-50">
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
              <button  >Create</button>
            </Link>
            <Link href="/how-it-works">
              <button >How It Works</button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-emerald-800 mb-12">
          Choose Your Plan
        </h1>

        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <div>
              <div>Free</div>
              <div>For casual listeners</div>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600 mb-4">
                $0
                <span className="text-lg font-normal text-emerald-600">
                  /month
                </span>
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />5 playlists
                  per month
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  Up to 20 songs per playlist
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  Basic mood analysis
                </li>
              </ul>
            </div>
            <div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Get Started
              </button>
            </div>
          </div>

          <div className="border-emerald-500 border-2">
            <div>
              <div>Pro</div>
              <div>For music enthusiasts</div>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600 mb-4">
                $9.99
                <span className="text-lg font-normal text-emerald-600">
                  /month
                </span>
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  Unlimited playlists
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  Up to 50 songs per playlist
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  Advanced mood analysis
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  Exclusive AI-curated collections
                </li>
              </ul>
            </div>
            <div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Upgrade to Pro
              </button>
            </div>
          </div>

          <div>
            <div>
              <div>Business</div>
              <div>For commercial use</div>
            </div>
            <div>
              <p className="text-3xl font-bold text-emerald-600 mb-4">
                $49.99
                <span className="text-lg font-normal text-emerald-600">
                  /month
                </span>
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  All Pro features
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  Multiple user accounts
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  API access
                </li>
                <li className="flex items-center">
                  <Check className="h-5 w-5 text-emerald-500 mr-2" />
                  Priority support
                </li>
              </ul>
            </div>
            <div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                Contact Sales
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-lg text-emerald-800 mb-4">
            Not sure which plan is right for you?
          </p>
          <Link href="/contact">
            <button
              
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-50"
            >
              Contact Us
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
    </div>
  );
}
