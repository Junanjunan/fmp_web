import { type AuthOptions } from 'next-auth'
import bcrypt from 'bcryptjs'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/database/prisma'
import { Session } from 'next-auth'


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
          name: user.name,
          image: user.image,
          email_verified: user.email_verified,
          created_at: user.created_at,
          updated_at: user.updated_at,
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
        const typedUser = user as Session["user"];
        token.id = typedUser.id;
        token.email = typedUser.email;
        token.name = typedUser.name;
        token.image = typedUser.image;
        token.email_verified = typedUser.email_verified;
        token.created_at = typedUser.created_at;
        token.updated_at = typedUser.updated_at;
      }
      return token;
    },
    async session({ session, token}) {
      if (session.user) {
        session.user.email_verified = token.email_verified;
        session.user.created_at = token.created_at;
        session.user.updated_at = token.updated_at;
      }
      return session;
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/login',
  },
}