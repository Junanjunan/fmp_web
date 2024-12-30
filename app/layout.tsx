import "./globals.css";
import { Header } from "@/app/components/client/Header";
import { SessionWrapper } from "@/app/components/client/auth/SessionWrapper";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body>
        <SessionWrapper session={session}>
          <Header />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
