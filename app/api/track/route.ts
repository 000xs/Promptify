import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  const body = await req.json();

  try {
    const tracks = await searchSpotifyGenres(
      body.token,
      body.genres,
      10,
      body.lanuge
    );
    console.log(tracks);
    return NextResponse.json({ tracks });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error }, { status: 500 });
  }
}async function searchSpotifyGenres(
  accessToken: string,
  genres: string[],
  limit: number,
  language: string // Parameter for language
): Promise<any[]> {
  const baseUrl = "https://api.spotify.com/v1/search";

  // Filter valid genres
  const validGenres = genres.filter(genre => 
      ["rock", "pop", "hip-hop", "electronic", "jazz"].includes(genre.toLowerCase())
  );

  // Construct the query by mapping valid genres
  const genreQueries = validGenres.map(genre => `genre:${encodeURIComponent(genre)}`);
  const query = genreQueries.join(" OR "); // Join genres with OR

  const params = {
      q: query,
      type: "track",
      limit: limit,
      locale: language, // Add locale parameter
  };

  const queryUrl = `${baseUrl}?${new URLSearchParams(params).toString()}`;
  
  console.log(`Query URL: ${queryUrl}`);

  try {
      const response = await axios.get(baseUrl, {
          headers: {
              Authorization: `Bearer ${accessToken}`,
          },
          params: params,
      });

      // console.log("Response data:", response.data); // Log full response data

      // Return only the tracks array
      return response.data.tracks.items.map(tracks => ({
          id: tracks.id,
          name: tracks.name,
          artists: tracks.artists.map(artist => artist.name),
          album: tracks.album.name,
          preview_url: tracks.preview_url, // Optional: return preview URL if available
          external_url: tracks.external_urls.spotify // Spotify link to the track
      }));
  } catch (error) {
      if (axios.isAxiosError(error)) {
          console.error("Error fetching data from Spotify API:", error.response?.data);
      } else {
          console.error("Unexpected error:", error);
      }
      throw new Error("Failed to fetch data from Spotify API");
  }
}