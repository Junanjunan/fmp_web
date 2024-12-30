import NextAuth, { type AuthOptions } from 'next-auth'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/database/prisma'


export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('email and password is required');
        }
        const user = await prisma.auth_user.findUnique({
          where: {
            email: credentials.email
          }
        });
        if (!user || !user?.hashed_password) {
          throw new Error('Invalid email or password');
        }
        const isCorrectPassword = await bcrypt.compare(
          credentials.password,
          user.hashed_password
        );
        if (!isCorrectPassword) {
          throw new Error('Password is incorrect');
        }
        return {
          id: user.id.toString(),
          email: user.email,
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }