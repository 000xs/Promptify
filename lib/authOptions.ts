import type { NextAuthOptions } from "next-auth";
import SpotifyProvider from "next-auth/providers/spotify";
import { JWT } from "next-auth/jwt";
import type { Session } from "next-auth"; // Importing Session type if available

interface CustomSession extends Session {
  accessToken?: string; // Optional property
  error?: string; // Optional property
}
interface Account {
  access_token?: string; // Optional since it may not always be present
  refresh_token?: string; // Optional
  expires_in?: number; // Optional
  // Add other properties as needed
}
const SCOPES =
  "playlist-modify-public playlist-modify-private user-read-private";

export const authOptions: NextAuthOptions = {
  providers: [
    SpotifyProvider({
      clientId: process.env.SPOTIFY_CLIENT_ID!,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET!,
      authorization: `https://accounts.spotify.com/authorize?scope=${SCOPES}`,
    }),
  ],
  callbacks: {
    async jwt({ token, account }: { token: JWT; account?: Account | null }) {
      if (account) {
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.expiresAt = Date.now() + (account.expires_in ?? 3600) * 1000; // Default to 1 hour
      }

      // Handle token refresh logic
      if (token.expiresAt && Date.now() >= Number(token.expiresAt)) {
        console.log("Refreshing access token...");
        try {
          const response = await fetch(
            "https://accounts.spotify.com/api/token",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: `Basic ${Buffer.from(
                  `${process.env.SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
                ).toString("base64")}`,
              },
              body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: token.refreshToken
                  ? String(token.refreshToken)
                  : "", // Explicit string conversion
              }),
            }
          );

          const refreshedTokens = await response.json();

          if (!response.ok) throw refreshedTokens;

          return {
            ...token,
            accessToken: refreshedTokens.access_token,
            expiresAt: Date.now() + refreshedTokens.expires_in * 1000,
          };
        } catch (error) {
          console.error("Failed to refresh access token:", error);
          return { ...token, error: "RefreshAccessTokenError" };
        }
      }

      return token;
    },

    async session({ session, token }: { session: CustomSession; token: JWT }) {
      session.accessToken = token.accessToken as string;
      session.error = token.error as string;
      return session; // Return the modified session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
