import { NextResponse } from "next/server";
import axios from "axios";
import { availableGenres } from "@/data/data"; // Assuming this exports an array of valid genres

export async function POST(req: Request) {
  const accesToken = req.headers.get("Authorization"); // Access header
  if (!accesToken || typeof accesToken !== "string") {
    return NextResponse.json(
      { error: "Authorization header is required and must be a string." },
      { status: 400 }
    );
  }
  const body = await req.json();
  if (
    !body.genres ||
    body.genres.length === 0 ||
    !body.query ||
    typeof body.query !== "string" ||
    !body.language ||
    typeof body.language !== "string"
  ) {
    return NextResponse.json(
      { error: "genres,query or language are required and must be strings." },
      { status: 400 }
    );
  }
  try {
    const tracks = await searchSpotifyGenres(
      accesToken,
      body.genres,
      body.limit,
      body.query, // Use the provided search query
      body.language // Corrected from body.lanuge to body.language
    );
    console.log(tracks);
    return NextResponse.json({ tracks });
  } catch (error) {
    const e = error as Error; // Type assertion
    console.error(e.message);
    return NextResponse.json({ error: e }, { status: 500 });
  }
}

interface Track {
  id: string;
  uri: string;
  name: string;
  album: {
    name: string;
  };
  preview_url?: string | null; // Optional property
  external_urls: {
    spotify: string;
  };
}

async function searchSpotifyGenres(
  accessToken: string,
  genres: string[],
  limit: number,
  searchQuery: string, // Use the provided search query
  language: string // Parameter for language
): Promise<Track[]> {
  const baseUrl = "https://api.spotify.com/v1/search";
  console.log(language);

  // Filter valid genres using availableGenres
  const validGenres = genres.filter((genre) =>
    availableGenres.includes(genre.toLowerCase())
  );

  // Construct genre queries
  const genreQueries = validGenres.map(
    (genre) => `genre:${encodeURIComponent(genre)}`
  );

  // Join genres with OR, handle case where no valid genres are found
  const genrePart = genreQueries.length > 0 ? genreQueries.join(" OR ") : ""; // Join with OR if there are valid genres

  // Construct the full query combining searchQuery and genrePart
  const fullQuery = [searchQuery, genrePart].filter(Boolean).join(" "); // Filter out any empty strings

  const params = {
    q: fullQuery, // Use dynamic query instead of hardcoded one
    type: "track",
    limit: limit || 10,
    locale: language || "SI", // Default to English if language is undefined
  };

  // console.log("Params:", params);

  try {
    const response = await axios.get(baseUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: params,
    });

    // console.log("Response data:", response.data); // Log full response data

    // Check if there are items in the response
    if (response.data.tracks.items.length === 0) {
      console.warn("No tracks found for the given genres.");
      return []; // Return an empty array if no tracks found
    }

    // Return only the tracks array
    return response.data.tracks.items.map((track: Track) => ({
      id: track.id,
      uri: track.uri,
      name: track.name,
      album: track.album.name,
      preview_url: track.preview_url || null, // Return null if no preview URL is available
      external_url: track.external_urls.spotify, // Spotify link to the track
    }));
    // return response.data.tracks.items;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching data from Spotify API:",
        error.response?.data
      );
      // return [{ error: error.response?.data }, { status: 500 }];
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Failed to fetch data from Spotify API");
  }
}
