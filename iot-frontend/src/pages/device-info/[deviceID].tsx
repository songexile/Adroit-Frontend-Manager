import Link from 'next/link'
import React from 'react'

interface Props {
  device: {
    name: string
  }
}

function Page(data: any) {
  console.log(data)
  return (
    <div>
      <Link href="/">HOme</Link>
      <h1>Device: yo</h1>
    </div>
  )
}

export default Page
