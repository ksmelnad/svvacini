import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import client from "@/utils/prismadb";
import type { Adapter } from "next-auth/adapters";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(client) as Adapter,
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
});
