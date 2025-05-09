import { LoginForm } from '@/app/components/client/auth/LoginForm'
import Link from 'next/link';


export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-6 bg-white rounded-lg shadow-md">
        <div>
          <h2 className="text-center text-3xl font-bold">Login</h2>
        </div>
        <LoginForm />
        <div className="text-center">
          <Link href="/auth/signup" className="text-blue-500 hover:underline">
            If you don&apos;t have an account, go to sign up
          </Link>
        </div>
      </div>
    </div>
  );
}