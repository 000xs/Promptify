"use client";

import Navigationbar from "@/components/Navigationbar";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useState, Fragment } from "react";
import { Loader2, Music } from "lucide-react";
import { Loading } from "@/components/Loading";
import Not from "@/components/Not";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [isGenerated, setIsGenerated] = useState("");
  const [error, setError] = useState("");

  const [genres, setGenres] = useState(["pop"]);
  const [searchQuery, setSearchQuery] = useState("pop");

  // States for form inputs
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("English");
  const [songCount, setSongCount] = useState(20);

  if (status === "loading") return <Loading />;
  if (!session?.accessToken) return <Not />;

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input values
    if (!prompt.trim()) {
      setError("Please describe your mood.");
      return;
    }
    if (songCount < 5 || songCount > 50) {
      setError("Number of songs must be between 5 and 50.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const step1 = await handleGetDataAI(prompt);
      if (!step1) throw new Error("Failed to generate data.");

      const step2 = await fetchTracks();
      if (!step2) throw new Error("Failed to fetch tracks.");

      const step3 = await createPlaylist();
      if (!step3) throw new Error("Failed to create playlist.");

      const step4 = await addTracksToPlaylist(step3, step2);
      if (!step4) throw new Error("Failed to add tracks to playlist.");

      setIsGenerated(createPlaylistUrlEmbed(step3));
      alert(`Playlist created successfully! ${createPlaylistUrl(step3)}`);
    } catch (error) {
      console.error(error);
      setError(
        "An error occurred while generating the playlist. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleGetDataAI = async (prompt: string) => {
    try {
      const response = await axios.post(
        "/api/song",
        { mood: prompt },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.accessToken || "",
          },
        }
      );
      if (!response.data) throw new Error("No data received.");

      setGenres(response.data.genres);
      setSearchQuery(response.data.query[0]);
      return true;
    } catch (error) {
      console.error(error);
      setError("Failed to generate song data.");
      return false;
    }
  };

  interface Track {
    uri: string;
  }

  const fetchTracks = async () => {
    try {
      const response = await axios.post(
        "/api/track",
        {
          genres,
          query: `${searchQuery} ${language}`,
          language,
          limit: songCount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.accessToken || "",
          },
        }
      );
      if (!response.data) throw new Error("No data received.");

      return response.data.tracks.map((track: Track) => track.uri);
    } catch (error) {
      console.error(error);
      setError("Failed to fetch tracks.");
      return false;
    }
  };

  const createPlaylist = async () => {
    try {
      const response = await axios.post(
        "/api/create-playlist",
        { mood: prompt },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.accessToken || "",
          },
        }
      );
      if (!response.data) throw new Error("No data received.");

      return response.data.uri;
    } catch (error) {
      console.error(error);
      setError("Failed to create playlist.");
      return false;
    }
  };

  const addTracksToPlaylist = async (playlistId: string, tracks: string[]) => {
    try {
      const response = await axios.post(
        "/api/add-tracks",
        { playlistId, tracks },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.accessToken || "",
          },
        }
      );
      if (!response.data) throw new Error("No data received.");

      return true;
    } catch (error) {
      console.error(error);
      setError("Failed to add tracks to playlist.");
      return false;
    }
  };

  const createPlaylistUrl = (uri: string): string => {
    const parts = uri.split(":");
    const id = parts[parts.length - 1];
    return `https://open.spotify.com/playlist/${id}`;
  };

  const createPlaylistUrlEmbed = (uri: string): string => {
    const parts = uri.split(":");
    const id = parts[parts.length - 1];
    return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator`;
  };

  return (
    <Fragment>
      <div className="flex min-h-screen flex-col">
        <Navigationbar />
        <main className="flex-1 bg-gradient-to-b from-emerald-50 to-white flex items-center justify-center">
          <div className="container max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold tracking-tight text-emerald-800 sm:text-5xl md:text-6xl">
                Create Your Playlist
              </h1>
              <p className="mt-3 max-w-md mx-auto text-base text-emerald-600 sm:text-lg md:mt-5 md:text-xl">
                Describe your mood and preferences to generate a personalized
                playlist.
              </p>
            </div>
            <div className="bg-white shadow-xl rounded-lg overflow-hidden">
              <div className="p-6 sm:p-10">
                {!isGenerated ? (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <label
                        htmlFor="mood"
                        className="block text-sm font-medium text-emerald-700"
                      >
                        Describe your mood
                      </label>
                      <textarea
                        id="mood"
                        placeholder="E.g. Feeling energetic and ready to workout, need upbeat music..."
                        className="min-h-[100px] p-4 w-full border-emerald-300 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
                        onChange={(e) => setPrompt(e.target.value)}
                        required
                      />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <label
                          htmlFor="language"
                          className="block text-sm font-medium text-emerald-700"
                        >
                          Preferred Language
                        </label>
                        <select
                          id="language"
                          className="w-full border-emerald-300 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
                          value={language}
                          onChange={(e) => setLanguage(e.target.value)}
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Spanish</option>
                          <option value="French">French</option>
                          <option value="German">German</option>
                          <option value="Italian">Italian</option>
                          <option value="Portuguese">Portuguese</option>
                          <option value="Chinese">Chinese</option>
                          <option value="Japanese">Japanese</option>
                          <option value="Korean">Korean</option>
                          <option value="Russian">Russian</option>
                          <option value="Arabic">Arabic</option>
                          <option value="Sinhala">Sinhala</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Turkish">Turkish</option>
                          <option value="Dutch">Dutch</option>
                          <option value="Polish">Polish</option>
                          <option value="Swedish">Swedish</option>
                          <option value="Greek">Greek</option>
                          <option value="Czech">Czech</option>
                          <option value="Romanian">Romanian</option>
                          <option value="Thai">Thai</option>
                          <option value="Vietnamese">Vietnamese</option>
                          <option value="Indonesian">Indonesian</option>
                          <option value="Tamil">Tamil</option>
                          <option value="Telugu">Telugu</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label
                          htmlFor="songCount"
                          className="block text-sm font-medium text-emerald-700"
                        >
                          Number of Songs
                        </label>
                        <input
                          id="songCount"
                          type="number"
                          min="5"
                          max="50"
                          defaultValue="20"
                          className="w-full border-emerald-300 rounded-lg focus:border-emerald-500 focus:ring-emerald-500"
                          value={songCount}
                          onChange={(e) => setSongCount(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                    {error && <p className="text-red-500 text-sm">{error}</p>}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="inline-flex items-center">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </div>
                      ) : (
                        <div className="inline-flex items-center">
                          <Music className="mr-2 h-5 w-5" />
                          Generate Playlist
                        </div>
                      )}
                    </button>
                  </form>
                ) : (
                  <div>
                    <iframe
                      className="rounded-lg"
                      src={isGenerated}
                      width="100%"
                      height="352"
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </Fragment>
  );
}
