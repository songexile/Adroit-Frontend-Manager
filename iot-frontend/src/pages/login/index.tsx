import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const LoginScreen = () => {
  return (
    <div className="h-screen bg-gradient-to-br from-slate-500 to-yellow-800 flex items-center justify-center">
      <div className="bg-black p-8 md:p-12 rounded-3xl shadow-2xl w-full md:w-auto max-w-md">
        <div className="flex justify-center mb-6">
          <Image
            src="/assets/img/Adroit-logo.png"
            alt="Adroit Company Logo"
            width={80}
            height={80}
          />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-white">
          Welcome Back
        </h1>
        <p className="text-white  -600 text-center mb-8">
          Please sign in to access your account.
        </p>
        <Link
          href="/api/auth/signin"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-colors duration-300 block text-center"
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
