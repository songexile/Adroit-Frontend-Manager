import { NextApiRequest, NextApiResponse } from "next";
import NextAuth from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { JWT } from "next-auth/jwt";
import { CustomUsers } from "@/types";

interface CustomToken extends JWT {
  family_name?: string;
  given_name?: string;
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  // Pre-processing, if needed
  console.log("Received request:", req.method, req.url);

  // Initialize NextAuth with your options
  const handler = await NextAuth(req, res, {
    providers: [
      CognitoProvider({
        clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
        clientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET as string,
        issuer: process.env.NEXT_PUBLIC_COGNITO_ISSUER,
        idToken: true,
        authorization: {
          params: {
            scope: "openid",
          },
        },
      }),
    ],
    callbacks: {
      async session({ session, token }) {
        // Add the additional user attributes to the session object
        if (token && (token as CustomToken).family_name && (token as CustomToken).given_name) {
          session.user = {
            ...(session.user as CustomUsers), // Cast session.user to CustomUsers
            given_name: (token as CustomToken).given_name,
            family_name: (token as CustomToken).family_name,
          };
        }

        return session;
      },

      async jwt({ token, user, account, profile }) {
        // Add the additional user attributes to the JWT token
        if (user && (user as CustomUsers).family_name && (user as CustomUsers).given_name) {
          (token as CustomToken).family_name = (user as CustomUsers).family_name;
          (token as CustomToken).given_name = (user as CustomUsers).given_name;
        }

        return { ...token, ...user, ...account, ...profile };
      },
    },
    theme: {
      colorScheme: "dark",
      brandColor: "#000",
      logo: "https://assets.adroit.nz/wp-content/uploads/2022/03/01113543/Adroit-environmental-monitoring.png",
      buttonText: "#fff",
    },
    secret: process.env.NEXT_PUBLIC_SECRET,
    debug: process.env.NODE_ENV === "development",
  });

  // Return the handler
  return handler;
}
