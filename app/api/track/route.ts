import { NextResponse } from "next/server";
import axios from "axios";
import { availableGenres } from "@/data/data"; // Assuming this exports an array of valid genres

export async function POST(req: Request) {
  const body = await req.json();
  try {
    const tracks = await searchSpotifyGenres(
      body.token,
      body.genres,
      10,
      body.query, // Use the provided search query
      body.language // Corrected from body.lanuge to body.language
    );
    console.log(tracks);
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json({ error: error}, { status: 500 });
  }
}

async function searchSpotifyGenres(
  accessToken: string,
  genres: string[],
  limit: number,
  searchQuery: string, // Use the provided search query
  language: string // Parameter for language
): Promise<any[]> {
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
    limit: limit,
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
    return response.data.tracks.items.map((track: any) => ({
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
    } else {
      console.error("Unexpected error:", error);
    }
    throw new Error("Failed to fetch data from Spotify API");
  }
}
