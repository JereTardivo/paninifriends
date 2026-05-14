import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Usuario", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const username = credentials.username.trim().toLowerCase();

        const existingUser = await prisma.user.findUnique({
          where: { username },
        });

        if (!existingUser) {
          const hashed = await bcrypt.hash(credentials.password, 10);
          const newUser = await prisma.user.create({
            data: { username, password: hashed },
          });
          return { id: newUser.id.toString(), name: newUser.username };
        }

        const valid = await bcrypt.compare(credentials.password, existingUser.password);
        if (!valid) return null;

        return { id: existingUser.id.toString(), name: existingUser.username };
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
  pages: { signIn: "/" },
};
