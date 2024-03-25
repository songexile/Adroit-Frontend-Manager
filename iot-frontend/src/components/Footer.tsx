import React from 'react'
const currentYear = new Date().getFullYear()
const establishedYear = 2015

const Footer = () => {
  return (
    <footer className="bg-blue-800 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm">
          Copyright © Adroit {establishedYear} - {currentYear}. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
