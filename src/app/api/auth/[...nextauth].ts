import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@nextauth/prisma-adapter";
import prisma from "../../../lib/prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        correo: { label: "Correo", type: "email" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        const usuario = await prisma.usuario.findUnique({
          where: { correo: credentials?.correo },
        });

        if (usuario && usuario.password === credentials?.password) {
          return usuario;
        }

        return null;
      },
    }),
  ],
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token = user;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = token;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
