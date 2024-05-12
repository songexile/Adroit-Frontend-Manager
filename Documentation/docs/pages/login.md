# Login Page

The login page is the entry point for users to authenticate and access the Adroit Frontend Manager application. It provides a simple and visually appealing interface for users to sign in. The login page is located at `iot-frontend/src/pages/login/index.tsx`.

## Components

The login page consists of the following components:

- A container div with a gradient background.
- An inner div containing the login form and content.
- The Adroit company logo.
- A welcome message and instructions for signing in.
- A sign-in button that redirects the user to the authentication page.

```tsx
import Link from 'next/link';
import React from 'react';
import Image from 'next/image';

const LoginScreen = () => {
  return (
    <div className='h-screen bg-gradient-to-br from-slate-500 to-yellow-800 flex items-center justify-center'>
      <div className='bg-black p-8 md:p-12 rounded-3xl shadow-2xl w-full md:w-auto max-w-md'>
        <div className='flex justify-center mb-6'>
          <Image
            src='/assets/img/Adroit-logo.png'
            alt='Adroit Company Logo'
            width='0'
            height='0'
            style={{ width: '80', height: '80' }}
          />
        </div>
        <h1 className='text-3xl font-bold text-center mb-6 text-white'>
          Welcome Back
        </h1>
        <p className='text-white -600 text-center mb-8'>
          Please sign in to access your account.
        </p>
        <Link
          href='/api/auth/signin'
          className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full shadow-md transition-colors duration-300 block text-center'
        >
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
```

## Redirection

When a user tries to access authenticated pages without being logged in, they will be redirected to the login page. The login page serves as the entry point for authentication and ensures that only authenticated users can access protected routes.

## Conclusion

The login page provides a simple and visually appealing interface for users to authenticate and access the Adroit Frontend Manager application. It uses Tailwind CSS classes for styling and ensures that only authenticated users can access protected routes.
