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
    You are a highly intelligent music assistant specializing in music categorization and playlist creation. Your goal is to generate accurate music genres that perfectly align with the user's mood.
    
    Mood: "${body.mood}"
    
    Output:
    1. List the top 10 most relevant music genres for the mood, ordered by relevance.
    2. For each genre, provide a brief description explaining why it suits the mood.
    3. Suggest an example artist or song for each genre.
    4. always format genre name between **genrename**.
    5. always output genre name clear **between nor numbers,symbol leters (ex:- **Acoustic**)**.
    
    Genres:
    1. Acoustic
    2. Afrobeat
    3. Alt-Rock
    4. Alternative
    5. Ambient
    6. Anime
    7. Blues
    8. Bossanova
    9. Brazilian
    10. Chill
    11. Classical
    12. Comedy
    13. Country
    14. Dance
    15. Dancehall
    16. Death-Metal
    17. Disco
    18. Drum-and-Bass
    19. Dubstep
    20. EDM
    21. Electronic
    22. Folk
    23. Funk
    24. Garage
    25. German
    26. Grunge
    27. Hip-Hop
    28. House
    29. Indie-Pop
    30. Industrial
    31. Jazz
    32. K-Pop
    33. Metal
    34. Mood
    35. Morning
    36. MPB (Música Popular Brasileira)
    37. Party
    38. Pop
    39. Punk
    40. R&B
    41. Reggae
    42. Rock
    43. Soul
    44. Spanish
    45. Summer
    46. Trap
    47. Workout
    `;

    const result = await geminiModel.generateContent(prompt);
    // Example usage:

    if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const playlistSuggestions =
        result.response.candidates[0].content.parts[0].text;
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
