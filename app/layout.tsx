import "./globals.css";
import { Header } from "@/app/components/client/Header";
import { SessionWrapper } from "@/app/components/client/auth/SessionWrapper";
import { getServerSession_ } from "@/lib/auth/session";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession_();

  return (
    <html lang="en">
      <body className="max-w-7xl mx-auto">
        <SessionWrapper session={session}>
          <Header />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
