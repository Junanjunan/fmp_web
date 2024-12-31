import "next-auth"


declare module "next-auth" {
  interface Session {
    user: {
      email_verified?: Date
      created_at?: Date
      updated_at?: Date
    } & DefaultSession["user"]
  }
}