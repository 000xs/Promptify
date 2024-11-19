import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const geminiApiKey = process.env.GEMINI_API_KEY;

if (!geminiApiKey) {
  throw new Error(
    "GEMINI_API_KEY is not defined in your environment variables."
  );
}

const googleAI = new GoogleGenerativeAI(geminiApiKey);

const geminiConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 4096,
};

const geminiModel = googleAI.getGenerativeModel({
  model: "gemini-pro",
  ...geminiConfig,
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.mood || typeof body.mood !== "string") {
      return NextResponse.json(
        { error: "Mood is required and must be a string." },
        { status: 400 }
      );
    }

    const prompt = `
    system message: You are a highly intelligent music assistant specializing in music categorization and playlist creation. Your goal is to generate accurate music genres that perfectly align with the user's mood.

    Mood: "${body.mood}"

    Output:
    1. List the top 10 most relevant music genres for the mood, ordered by relevance.
    2. always should list minimuem 5 genres.
    3. Always format genre names between **double asterisks** (e.g., **GenreName**).
    4. Ensure that genre names are clear and formatted without numbers or symbols (e.g., **Acoustic**).
    5. Output the genres in a numbered list.
    6. Provide the genres' syntax/spelling as a list of strings.
    7. I have provided a list of genres as an array. Please find each specified genre within this array and return its index. If a genre is not found, return -1.
    
    Output Format :
      ##array_index1##: **GenreName1**
      ##array_index2##: **GenreName2**,
      .... : ......

    Genres list:  [
      "acoustic",
      "afrobeat",
      "alt-rock",
      "alternative",
      "ambient",
      "anime",
      "black-metal",
      "bluegrass",
      "blues",
      "bossanova",
      "brazil",
      "breakbeat",
      "british",
      "cantopop",
      "chicago-house",
      "children",
      "chill",
      "classical",
      "club",
      "comedy",
      "country",
      "dance",
      "dancehall",
      "death-metal",
      "deep-house",
      "detroit-techno",
      "disco",
      "disney",
      "drum-and-bass",
      "dub",
      "dubstep",
      "edm",
      "electro",
      "electronic",
      "emo",
      "folk",
      "forro",
      "french",
      "funk",
      "garage",
      "german",
      "gospel",
      "goth",
      "grindcore",
      "groove",
      "grunge",
      "guitar",
      "happy",
      "hard-rock",
      "hardcore",
      "hardstyle",
      "heavy-metal",
      "hip-hop",
      "holidays",
      "honky-tonk",
      "house",
      "idm",
      "indian",
      "indie",
      "indie-pop",
      "industrial",
      "iranian",
      "j-dance",
      "j-idol",
      "j-pop",
      "j-rock",
      "jazz",
      "k-pop",
      "kids",
      "latin",
      "latino",
      "malay",
      "mandopop",
      "metal",
      "metal-misc",
      "metalcore",
      "minimal-techno",
      "movies",
      "mpb",
      "new-age",
      "new-release",
      "opera",
      "pagode",
      "party",
      "philippines-opm",
      "piano",
      "pop",
      "pop-film",
      "post-dubstep",
      "power-pop",
      "progressive-house",
      "psych-rock",
      "punk",
      "punk-rock",
      "r-n-b",
      "rainy-day",
      "reggae",
      "reggaeton",
      "road-trip",
      "rock",
      "rock-n-roll",
      "rockabilly",
      "romance",
      "sad",
      "salsa",
      "samba",
      "sertanejo",
      "show-tunes",
      "singer-songwriter",
      "ska",
      "sleep",
      "songwriter",
      "soul",
      "soundtracks",
      "spanish",
      "study",
      "summer",
      "swedish",
      "synth-pop",
      "tango",
      "techno",
      "trance",
      "trip-hop",
      "turkish",
      "work-out",
      "world-music",
    ];
    
`;
    const result = await geminiModel.generateContent(prompt);
    // Example usage:

    if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const playlistSuggestions =
        result.response.candidates[0].content.parts[0].text;
      console.log(playlistSuggestions);
      const returnData = String(playlistSuggestions);
      const genres = extractBoldText(returnData);
      return NextResponse.json({ genres });
    }

    throw new Error("Unexpected response structure from Gemini AI.");
  } catch (error: any) {
    console.error("Error generating playlist:", error);
    return NextResponse.json(
      {
        error: "Failed to generate playlist suggestions.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
function extractBoldText(input: string): string[] {
  const regex = /\*\*(.*?)\*\*/g; // Regular expression to match text between double asterisks
  const matches: string[] = [];
  let match;

  // Loop through all matches in the input string
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]); // Push the captured group (text between asterisks) to the array
  }

  return matches; // Return the array of matches
}

const generateTrack = async (
  genre: string,
  languageKeyword: string,
  limit: number,
  accessToken: string
) => {
  const apiUrl = `https://api.spotify.com/v1/search?q=genre:${encodeURIComponent(
    genre
  )}%20AND%20${encodeURIComponent(languageKeyword)}&type=track&limit=${limit}`;

  console.log("Generated API URL:", apiUrl);

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(
        `Spotify API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    console.log("Tracks:", data.tracks.items);
    return data.tracks.items; // Return the tracks for further processing
  } catch (error) {
    console.error("Error fetching tracks:", error);
    return null;
  }
};

// Usage Example
const genre = "pop";
const languageKeyword = "español";
const limit = 10;
const accessToken = "your_access_token_here";

generateTrack(genre, languageKeyword, limit, accessToken);
