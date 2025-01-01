import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import prisma from "@/prisma/client"

export const authOptions: NextAuthOptions = {
    pages: {
      signIn: '/auth/signin',
      error: '/auth/error',
    },
    adapter: PrismaAdapter(prisma),
    callbacks: {
        async session({ session, user }) {
            if (user) {
              session.user.id = user.id;
            }
            return session;
        },
        async redirect({ url, baseUrl }) {
          if (url.startsWith("/")) return `${baseUrl}${url}`
          else if (new URL(url).origin === baseUrl) return url
          return baseUrl
        },
    },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    session: {
        strategy: "jwt"
    },
    events: {
        async createUser({ user }) {
            const defaultCategories = await prisma.category.findMany({
              where: { userID: "global-user" },
            });
        
            for (const category of defaultCategories) {
              await prisma.category.create({
                data: {
                  title: category.title,
                  userID: user.id,
                },
              });
            }
        },
    }
}

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }