import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/prisma/client"

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, user }) {
            if (user) {
              session.user.id = user.id;
            }
            return session;
    }},
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    session: {
        strategy: "jwt"
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }