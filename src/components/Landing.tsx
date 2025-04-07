'use client';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-tr from-indigo-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to PDF Extractor</h1>
        <p className="text-gray-600 mb-8">
          Upload, preview, and extract specific pages from PDF documents.
        </p>

        <div className="flex justify-center gap-6">
          <button
            onClick={() => router.push('/login')}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl text-lg font-medium hover:bg-indigo-700 transition duration-200"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/signup')}
            className="border border-indigo-600 text-indigo-600 px-6 py-2 rounded-xl text-lg font-medium hover:bg-indigo-50 transition duration-200"
          >
            Sign Up
          </button>
        </div>
      </div>
    </main>
  );
}
