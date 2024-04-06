import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions, Session, User } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { JWT } from "next-auth/jwt";

// Define custom types
interface CustomUser extends User {
  given_name: string;
  family_name: string;
}

interface CustomSession extends Session {
  user: CustomUser;
}

interface CustomToken extends JWT {
  given_name: string;
  family_name: string;
}

const authOptions: NextAuthOptions = {
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
    async signIn({ user, profile }) {
      if (profile && typeof profile === 'object') {
        (user as CustomUser).given_name = (profile as any).given_name;
        (user as CustomUser).family_name = (profile as any).family_name;
      }
      return true;
    },
    async session({ session, token }): Promise<CustomSession> {
      if (token) {
        (session.user as CustomUser).given_name = (token as CustomToken).given_name;
        (session.user as CustomUser).family_name = (token as CustomToken).family_name;
      }
      return session as CustomSession;
    },
    async jwt({ token, user }): Promise<CustomToken> {
      if (user) {
        (token as CustomToken).given_name = (user as CustomUser).given_name;
        (token as CustomToken).family_name = (user as CustomUser).family_name;
      }
      return token as CustomToken;
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
};

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  console.log("Received request:", req.method, req.url);
  const session = await NextAuth(req, res, authOptions);
  return session;
}
