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
  const [lodeing, setLodeing] = useState(false);
  const [isGenerated, setIsGenerated] = useState("");

  const [genres, setGenres] = useState(["pop"]);
  const [searchQuery, setSearchQuery] = useState("pop");

  // States for form inputs
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("English");
  const [songCount, setSongCount] = useState(1);

  if (status === "loading") return <Loading />;
  if (!session?.accessToken) return <Not />;

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate input values
    if (!prompt || songCount < 1 || songCount > 100) {
      alert("Please provide valid input values.");
      return;
    }
    setLodeing(true);

    const step1 = await handleGetDataAI(prompt);

    if (step1) {
      console.log("step 1");
      const step2 = await fetchTracks();
      if (step2) {
        console.log("step 2");
        const step3 = await createPlaylist();
        if (step3) {
          console.log("step 3");

          const step4 = await addTracksToPlaylist(step3, step2);
          if (step4) {
            console.log("step 4");
            alert(createPlaylistUrl(step3));
            setIsGenerated(createPlaylistUrlEmbed(step3));
            setLodeing(false);
          }
        }
      }
    }
  };

  const handleGetDataAI = async (prompt: string) => {
    try {
      const response = await axios.post(
        "/api/song",
        {
          mood: prompt, // Directly include `mood` in the body
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.accessToken || "", // Fallback for undefined session
          },
        }
      );
      if (!response.data) {
        console.log("No data received, loading...");
        return;
      }

      setGenres(response.data.genres);
      setSearchQuery(response.data.query[0]);

      return true;
    } catch (error) {
      const e = error as Error; // Type assertion
      console.error(e.message);
      alert("An error occurred while generating songs.");
      return false;
    }
  };
  interface Track {
    uri: string; // Assuming 'uri' is a string; add other properties as needed
    // Add other properties if necessary, e.g.:
    // id: string;
    // name: string;
    // album: { name: string };
    // etc.
  }
  const fetchTracks = async () => {
    try {
      const response = await axios.post(
        "/api/track",
        {
          genres: genres, // Directly include `mood` in the body
          query: searchQuery + " " + language,
          language: language,
          limit: songCount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.accessToken || "", // Fallback for undefined session
          },
        }
      );
      if (!response.data) {
        console.log("No data received, loading...");
        return;
      }
      const tracks = response.data.tracks.map((track: Track) => track.uri);

      return tracks;
    } catch (error) {
      const e = error as Error; // Type assertion
      console.error(e.message);
      alert("An error occurred while generating songs.");
      return false;
    }
  };
  const createPlaylist = async () => {
    try {
      const response = await axios.post(
        "/api/create-playlist",
        {
          mood: prompt, // Directly include `mood` in the body
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.accessToken || "", // Fallback for undefined session
          },
        }
      );
      if (!response.data) {
        console.log("No data received, loading...");
        return;
      }

      return response.data.uri;
    } catch (error) {
      const e = error as Error; // Type assertion
      console.error(e.message);
      alert("An error occurred while generating songs.");
      return false;
    }
  };

  const addTracksToPlaylist = async (
    playlistIds: string,
    trackss: string[]
  ) => {
    try {
      const response = await axios.post(
        "/api/add-tracks",
        {
          playlistId: playlistIds,
          tracks: trackss,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: session?.accessToken || "", // Fallback for undefined session
          },
        }
      );
      if (!response.data) {
        console.log("No data received, loading...");
        return;
      }

      return true;
    } catch (error) {
      const e = error as Error; // Type assertion
      console.error(e.message);
      alert("An error occurred while generating songs.");
      return false;
    }
  };

  function createPlaylistUrl(uri: string): string {
    // Split the string by ':' and take the last part
    const parts = uri.split(":");
    const baseURL = "https://open.spotify.com/playlist/";
    const id = parts[parts.length - 1];
    return `${baseURL}${id}`;
  }
  function createPlaylistUrlEmbed(uri: string): string {
    // Split the string by ':' and take the last part
    const parts = uri.split(":");

    const id = parts[parts.length - 1];
    // return `${baseURL}${id}`;
    return `https://open.spotify.com/embed/playlist/${id}?utm_source=generator`;
  }

  return (
    <Fragment>
      <div className="flex min-h-screen flex-col ">
        <Navigationbar />
        <main className="flex-1 bg-gradient-to-b from-emerald-50 to-white justify-center flex items-center">
          <div className="container max-w-4xl py-12  px-4 sm:px-6 lg:px-8">
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
                        className="min-h-[100px] p-4 w-full border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
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
                          className="w-full border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
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
                          className="w-full border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500"
                          value={songCount}
                          onChange={(e) => setSongCount(Number(e.target.value))}
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
                    >
                      {lodeing ? (
                        <div className="inline-flex ">
                          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                          Generating...
                        </div>
                      ) : (
                        <div className="inline-flex ">
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
