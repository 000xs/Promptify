import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import { availableGenres } from "@/data/data";

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
    const accesToken = req.headers.get("Authorization"); // Access header
    if (!accesToken || typeof accesToken !== "string") {
      return NextResponse.json(
        { error: "Authorization header is required and must be a string." },
        { status: 400 }
      );
    }
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
    1. List the top 1 most relevant music genre for the mood, ordered by relevance.
    2. Always list a minimum of 1 genre.
    3. Format genre names between **double asterisks** (e.g., **GenreName**).
    4. Ensure that genre names are clear and formatted without numbers or symbols (e.g., **Acoustic**).
    5. Output the genre in a numbered list.
    6. Provide the genre's syntax/spelling as a list of strings.
    7. I have provided a list of genres as an array. Please find each specified genre within this array and return its index. If a genre is not found, return -1.
    8. In between %% add a unique search query (e.g., %%query%%).
    
    Output Format:
      %%search_query%%
      ##array_index##: **GenreName** 
 

Genres list:  [
  0 "acoustic",
  1 "afrobeat",
  2 "alt-rock",
  3 "alternative",
  4 "ambient",
  5 "anime",
  6 "black-metal",
  7 "bluegrass",
  8 "blues",
  9 "bossanova",
  10 "brazil",
  11 "breakbeat",
  12 "british",
  13 "cantopop",
  14 "chicago-house",
  15 "children",
  16 "chill",
  17 "classical",
  18 "club",
  19 "comedy",
  20 "country",
  21 "dance",
  22 "dancehall",
  23 "death-metal",
  24 "deep-house",
  25 "detroit-techno",
  26 "disco",
  27 "disney",
  28 "drum-and-bass",
  29 "dub",
  30 "dubstep",
  31 "edm",
  32 "electro",
  34 "electronic",
  35 "emo",
  36 "folk",
  37 "forro",
  38 "french",
  39 "funk",
  40 "garage",
  41 "german",
  42 "gospel",
  43 "goth",
  44 "grindcore",
  45 "groove",
  46 "grunge",
  47 "guitar",
  48 "happy",
  49 "hard-rock",
  50 "hardcore",
  51 "hardstyle",
  52 "heavy-metal",
  53 "hip-hop",
  54 "holidays",
  55 "honky-tonk",
  56 "house",
  57 "idm",
  58 "indian",
  59 "indie",
  60 "indie-pop",
  61 "industrial",
  62 "iranian",
  63 "j-dance",
  64 "j-idol",
  65 "j-pop",
  66 "j-rock",
  67 "jazz",
  68 "k-pop",
  69 "kids",
  70 "latin",
  71 "latino",
  72 "malay",
  73 "mandopop",
  74 "metal",
  75 "metal-misc",
  76 "metalcore",
  77 "minimal-techno",
  78 "movies",
  79 "mpb",
  80 "new-age",
  81 "new-release",
  82 "opera",
  83 "pagode",
  84 "party",
  85 "philippines-opm",
  86 "piano",
  87 "pop",
  88 "pop-film",
  89 "post-dubstep",
  90 "power-pop",
  91 "progressive-house",
  92 "psych-rock",
  93 "punk",
  94 "punk-rock",
  95 "r-n-b",
  96 "rainy-day",
  97 "reggae",
  98 "reggaeton",
  99 "road-trip",
  100 "rock",
  101 "rock-n-roll",
  102 "rockabilly",
  103 "romance",
  104 "sad",
  105 "salsa",
  106 "samba",
  107 "sertanejo",
  108 "show-tunes",
  109 "singer-songwriter",
  110 "ska",
  111 "sleep",
  112 "songwriter",
  113 "soul",
  114 "soundtracks",
  115 "spanish",
  116 "study",
  117 "summer",
  118 "swedish",
  119 "synth-pop",
  120 "tango",
  121 "techno",
  122 "trance",
  123 "trip-hop",
  124 "turkish",
  125 "work-out",
  126 "world-music",
];

`;

    const result = await geminiModel.generateContent(prompt);
    // Example usage:

    if (result?.response?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const playlistSuggestions =
        result.response.candidates[0].content.parts[0].text;
      console.log(playlistSuggestions);
      const returnData = String(playlistSuggestions);
      const genres = genreTrim(returnData);
      const indexs = indexTrim(returnData);
      const query = queryTrim(returnData);

      const realData = arrData(indexs);

      return NextResponse.json(
        { genres, indexs, realData, query },
        { status: 200 }
      );
    }

    throw new Error("Unexpected response structure from Gemini AI.");
  } catch (error) {
    const e = error as Error; // Type assertion
    console.error(e.message);
     
    return NextResponse.json(
      {
        error: "Failed to generate playlist suggestions.",
        details: e,
      },
      { status: 500 }
    );
  }
}
function genreTrim(input: string): string[] {
  const regex = /\*\*(.*?)\*\*/g; // Regular expression to match text between double asterisks
  const matches: string[] = [];
  let match;

  // Loop through all matches in the input string
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]); // Push the captured group (text between asterisks) to the array
  }

  return matches; // Return the array of matches
}

function indexTrim(input: string): string[] {
  const regex = /\#\#(.*?)\#\#/g; // Regular expression to match text between double asterisks
  const matches: string[] = [];
  let match;

  // Loop through all matches in the input string
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]); // Push the captured group (text between asterisks) to the array
  }

  return matches; // Return the array of matches
}
function queryTrim(input: string): string[] {
  const regex = /\%\%(.*?)\%\%/g; // Regular expression to match text between double asterisks
  const matches: string[] = [];
  let match;

  // Loop through all matches in the input string
  while ((match = regex.exec(input)) !== null) {
    matches.push(match[1]); // Push the captured group (text between asterisks) to the array
  }

  return matches; // Return the array of matches
}
const arrData = (index: string[]): string[] => {
  const arr: string[] = [];
  for (let i = -1; i < index.length; i++) {
    arr.push(availableGenres[Number(index[i])]);
  }
  return arr;
};
