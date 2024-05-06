import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import CognitoProvider from "next-auth/providers/cognito";
import { CustomUser, CustomSession, CustomToken } from "@/types/index";

const authOptions: NextAuthOptions = {
  providers: [
    CognitoProvider({
      clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET as string,
      issuer: process.env.NEXT_PUBLIC_COGNITO_ISSUER,
      idToken: true,
      authorization: {
        params: {
          scope: "phone openid profile email aws.cognito.signin.user.admin",
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      if (profile && typeof profile === 'object') {
        (user as CustomUser).username = (profile as any)['cognito:username'];
        (user as CustomUser).given_name = (profile as any).given_name;
        (user as CustomUser).family_name = (profile as any).family_name;
        (user as CustomUser).email = (profile as any).email;
      }
      return true;
    },
    async session({ session, token }): Promise<CustomSession> {
      if (token) {
        (session.user as CustomUser).username = (token as CustomToken).username;
        (session.user as CustomUser).given_name = (token as CustomToken).given_name;
        (session.user as CustomUser).family_name = (token as CustomToken).family_name;
        (session.user as CustomUser).email = token.email as string;
        (session as CustomSession).accessToken = token.accessToken as string;
      }
      return session as CustomSession;
    },
    async jwt({ token, user, account }) {
      if (user) {
        (token as CustomToken).username = (user as CustomUser).username;
        (token as CustomToken).given_name = (user as CustomUser).given_name;
        (token as CustomToken).family_name = (user as CustomUser).family_name;
      }
      if (account) {
        (token as CustomToken).accessToken = account.access_token;
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
  try {
    console.log("Received request:", req.method, req.url);
    const session = await NextAuth(req, res, authOptions);
    return session;
  } catch (error) {
    console.error("An error occurred during authentication:", error);
    throw error;
  }
}
