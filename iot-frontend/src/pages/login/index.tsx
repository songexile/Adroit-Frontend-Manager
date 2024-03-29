import Link from 'next/link'
import React from 'react'

const LoginScreen = () => {
  return (
    <div className="h-screen bg-bg flex flex-col text-black/90">
      <div className="m-auto bg-bg-700 px-4 md:px-10 py-20 md:rounded-3xl w-full md:w-fit flex flex-col">
        <h1 className="text-2xl text-center mb-10">You Are Not Logged In</h1>
        <Link className="btn-primary" href="/api/auth/signin">
          Sign In
        </Link>
      </div>
    </div>
  )
}

export default LoginScreen
