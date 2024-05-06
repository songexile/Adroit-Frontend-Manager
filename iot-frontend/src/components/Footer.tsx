import React from 'react';
const currentYear = new Date().getFullYear();
const establishedYear = 2015;

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b  from-cyan-600 to-blue-500 text-white py-2 px-4">
      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm text-center">
          Copyright © Adroit {establishedYear} - {currentYear}. All rights reserved.
        </p>
      </div>

      <div className="container mx-auto flex items-center justify-center">
        <p className="text-sm text-center">v0.0.16</p>
      </div>
    </footer>
  );
};

export default Footer;
