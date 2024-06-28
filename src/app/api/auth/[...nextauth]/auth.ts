import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import client from "@/utils/prismadb";
export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  adapter: PrismaAdapter(client),
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
});
