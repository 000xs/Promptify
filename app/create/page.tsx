"use client";

import Navigationbar from "@/components/Navigationbar";
import axios from "axios";
import { useSession, signIn } from "next-auth/react";
import { useState, Fragment } from "react";

export default function HomePage() {
  const { data: session, status } = useSession();
  const [lodeing, setLodeing] = useState(false);

  const [aiData, setAIData] = useState("");
  const [genres, setGenres] = useState(["pop"]);
  const [searchQuery, setSearchQuery] = useState("pop");

  const [tracks, setTracks] = useState([]);
  const [playlistId, setPlaylistId] = useState("");

  // States for form inputs
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("English");
  const [songCount, setSongCount] = useState(1);

  if (status === "loading") return <p>Loading...</p>;

  // Form submission handler
  const handleSubmit = async (e: any) => {
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

      // Update the state with response data
      setAIData(response.data);
      setGenres(response.data.genres);
      setSearchQuery(response.data.query[0]);

      return true;
    } catch (error: string | any) {
      console.error(error.response.data.error);
      alert("An error occurred while generating songs.");
      return false;
    }
  };

  const fetchTracks = async () => {
    try {
      const response = await axios.post(
        "/api/track",
        {
          genres: genres, // Directly include `mood` in the body
          query: searchQuery +  " " + language,
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
      const tracks = response.data.tracks.map((track: any) => track.uri);

      return tracks;
    } catch (error: string | any) {
      console.error(error.response.data.error);
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
      setPlaylistId(
        response.data.uri || "spotify:playlist:12VnkbFPZG4a2un3AssCzU"
      );

      return response.data.uri;
    } catch (error: string | any) {
      console.error(error.response.data.error);
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
    } catch (error: string | any) {
      console.error(error.response.data.error);
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

  return (
    <Fragment>
      <div className="w-full h-screen bg-green-500">
        <Navigationbar />
        <div className="flex items-center justify-center px-24">
          <div className="container rounded-md bg-black text-white">
            {!lodeing ? (
              <div>
                {session ? (
                  <form
                    onSubmit={handleSubmit}
                    className="flex flex-col px-8 py-8 space-y-4"
                  >
                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor="prompt"
                        className="text-white font-medium"
                      >
                        Describe your feelings
                      </label>
                      <textarea
                        name="prompt"
                        id="prompt"
                        placeholder="Prompt..."
                        className="bg-gray-950 placeholder:text-gray-400 text-gray-300 border rounded-md p-2 border-white"
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                      ></textarea>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor="language"
                        className="text-white font-medium"
                      >
                        Language
                      </label>
                      <select
                        id="language"
                        className="border rounded-md p-2 border-white bg-gray-950 text-white"
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
                    <div className="flex flex-col space-y-2">
                      <label
                        htmlFor="number"
                        className="text-white font-medium"
                      >
                        Count of Songs (max 50)
                      </label>
                      <input
                        type="number"
                        name="number"
                        id="number"
                        max="50"
                        min="1"
                        className="bg-gray-950 p-2 border-white border rounded-md"
                        value={songCount}
                        onChange={(e) => setSongCount(Number(e.target.value))}
                      />
                    </div>
                    <input
                      type="submit"
                      disabled={lodeing}
                      value="✨Generate"
                      className="bg-gray-950 p-2 border-white border rounded-md cursor-pointer"
                    />
                  </form>
                ) : (
                  <button
                    onClick={() => signIn()}
                    className="bg-gray-950 p-2 text-white rounded-md"
                  >
                    Sign in
                  </button>
                )}
              </div>
            ) : (
              <div className="loading h-[50vh] blur-[1px] flex justify-center items-center ">
                <p className="text-white">Loding...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
