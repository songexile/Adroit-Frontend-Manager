// /pages/api/auth/[...nextauth].ts
import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Pre-processing, if needed
  console.log("Received request:", req.method, req.url);

  // Initialize NextAuth with your options
  const handler = await NextAuth(req, res, {
    providers: [
      CognitoProvider({
        clientId: process.env.COGNITO_CLIENT_ID as string,
        clientSecret: process.env.COGNITO_CLIENT_SECRET as string,
        issuer: process.env.COGNITO_ISSUER,
      })
    ],
    theme: {
      colorScheme: "dark", // "auto" | "dark" | "light"
      brandColor: "#000", // Hex color code
      logo: "https://assets.adroit.nz/wp-content/uploads/2022/03/01113543/Adroit-environmental-monitoring.png", // Absolute URL to image
      buttonText: "#fff" // Hex color code
    },
    // Enable debug messages in the console if you are having problems
    debug: process.env.NODE_ENV === 'development',
  });

  // Return the handler
  return handler;
}
