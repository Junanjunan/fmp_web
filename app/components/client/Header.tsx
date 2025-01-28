'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'


export function Header() {
  const { data: session, status } = useSession();

  return (
    <header className="p-4 bg-white shadow">
      <nav className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/" className="text-xl font-bold">
            Logo
          </Link>
        </div>
        <div>
          {status === 'loading' ? (
            <div>Loading...</div>
          ) : session ? (
            <div className="flex items-center gap-4">
              <span>{session.user?.email}</span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn()}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}