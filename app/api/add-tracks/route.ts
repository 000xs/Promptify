import { NextRequest, NextResponse } from "next/server";
import SpotifyWebApi from "spotify-web-api-node";
import dotenv from "dotenv";

dotenv.config();

// Spotify API client setup
const spotifyApi = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID || "",
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET || "",
  redirectUri: process.env.SPOTIFY_REDIRECT_URI || "",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { userAccessToken, playlistId, trackUri } = body;

    // Validate inputs
    if (
      !userAccessToken ||
      typeof userAccessToken !== "string" ||
      !playlistId ||
      typeof playlistId !== "string" ||
      !trackUri ||
      typeof trackUri !== "string"
    ) {
      return NextResponse.json(
        {
          error:
            "userAccessToken, playlistId, and trackUri are required and must be strings.",
        },
        { status: 400 }
      );
    }

    // Extract playlist ID if a full URI is provided
    const cleanPlaylistId = extractIdFromUri(playlistId, "playlist");
    if (!cleanPlaylistId) {
      return NextResponse.json(
        { error: "Invalid playlist ID format." },
        { status: 400 }
      );
    }

    // Validate track URI format
    if (!isValidSpotifyUri(trackUri, "track")) {
      return NextResponse.json(
        { error: "Invalid track URI format." },
        { status: 400 }
      );
    }

    // Set the access token for Spotify API
    spotifyApi.setAccessToken(userAccessToken);

    // Add the track to the playlist
    const response = await addTrackToPlaylist(cleanPlaylistId, trackUri);

    return NextResponse.json({
      message: "Track added successfully to the playlist",
      snapshotId: response.snapshot_id, // Snapshot ID of the playlist after modification
    });
  } catch (error: any) {
    console.error("Error adding track to playlist:", error);
    return NextResponse.json(
      { error: "Internal server error", details: error.message || error },
      { status: 500 }
    );
  }
}

const extractIdFromUri = (
  uri: string,
  type: "playlist" | "track"
): string | null => {
  const regex = new RegExp(`spotify:${type}:([a-zA-Z0-9]+)`);
  const match = uri.match(regex);
  return match ? match[1] : uri; // If no match, assume it's already an ID
};

const isValidSpotifyUri = (
  uri: string,
  type: "playlist" | "track"
): boolean => {
  const regex = new RegExp(`^spotify:${type}:[a-zA-Z0-9]+$`);
  return regex.test(uri);
};

const addTrackToPlaylist = async (
  playlistId: string,
  trackUri: string
): Promise<SpotifyApi.AddTracksToPlaylistResponse> => {
  try {
    const response = await spotifyApi.addTracksToPlaylist(playlistId, [
      trackUri,
    ]);
    return response.body; // Return the response body for snapshot ID
  } catch (error: any) {
    console.error("Spotify API Error:", error.message || error);
    console.error("Error Details:", error.body || error);
    throw new Error("Failed to add track to Spotify playlist.");
  }
};
