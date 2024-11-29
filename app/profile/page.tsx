"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Music2, Settings, LogOut } from "lucide-react";
import { Loading } from "@/components/Loading";
import Navigationbar from "@/components/Navigationbar";
import { useSession } from "next-auth/react";
import axios from "axios";
// Mock data for the user and playlists
interface Playlist {
  id: string;
  name: string;
  url: string;
}
export default function ProfilePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  async function getUserPlaylists(token: string): Promise<void> {
    const url = "https://api.spotify.com/v1/me/playlists";

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to Authorization header
        },
      });

      const playlists = response.data.items;
      setPlaylists(response.data.items);
      console.log("User's Playlists:", playlists);
      // playlists.forEach((playlist: any) => {
      //   console.log(
      //     `Name: ${playlist.name}, URL: ${playlist.external_urls.spotify}`
      //   );
      // });
    } catch (error: any) {
      console.error(
        "Error fetching playlists:",
        error || error.message || error.data
      );
    }
  }

  // Example usage
  // Replace with a valid access token
  useEffect(() => {
    getUserPlaylists(session?.accessToken as string);
  });

  const { data: session, status } = useSession();

  if (status === "loading") return <Loading />;

  return (
    <div className="min-h-screen bg-emerald-50">
      <Navigationbar />
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-1 space-y-4">
            <div className="px-4 py-6">
              <h1 className="text-2xl font-bold text-emerald-800">Profile</h1>
            </div>
            <div className="flex flex-col items-center">
              <div className="h-24 w-24 mb-4">
                <img
                  src={session?.user?.image as string}
                  alt={session?.user?.name as string}
                  className="h-full w-full rounded-full object-cover"
                />
                {/* <AvatarFallback>{user.name.charAt(0)}</AvatarFallback> */}
              </div>
              <h2 className="text-2xl font-bold text-emerald-800">
                {session?.user?.name}
              </h2>
              <p className="text-emerald-600">{session?.user?.email}</p>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-emerald-800">
                Your Playlists
              </h1>
              <p className="text-lg   text-emerald-600">
                Here are the playlists you've generated
              </p>
            </div>
            <div>
              <div className="space-y-4">
                {playlists.map((playlist) => (
                  <div
                    key={playlist.id}
                    className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-800">
                        {playlist.name}
                      </h3>
                      <p className="text-sm text-emerald-600">
                        {playlist.description}
                      </p>
                    </div>
                    <button>View</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
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
