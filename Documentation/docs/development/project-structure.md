# File Tree

## FrontEnd Project Structure

```
├── mocks                       // Mock files for testing
|  |
├── tests
│   └── pages                   // Unit test files for pages
|  |
├── public
│   ├── assets
│   │   └── img                 // Public image assets
│   ├── fonts                   // Public fonts
│   └── svg                     // Public SVG files
|  |
└── src
    ├── app                     // Next.js app directory
    ├── components
    │   ├── charts              // Chart components
    │   ├── context             // React context providers
    │   ├── iotTable            // IoT table components
    │   └── ui                  // Reusable UI components
    ├── constants               // Constants and configuration
    ├── hooks                   // Custom React hooks
    ├── layouts                 // Page layout components
    ├── libs                    // Utility libraries
    ├── pages
    │   ├── api
    │   │   └── auth            // Authentication API routes
    │   ├── create-ticket       // Create ticket page
    │   ├── device-info         // Device information page
    │   ├── login               // Login page
    │   └── profile             // User profile page
    ├── styles                  // Global styles
    ├── types                   // TypeScript type definitions
    └── utils                   // Utility functions
|  |
├── .editorconfig               // Editor configuration
├── .env.example                // Example environment variables
├── .eslintrc.js                // ESLint configuration (JS)
├── .eslintrc.json              // ESLint configuration (JSON)
├── .gitignore                  // Git ignore file
├── .npmrc                      // NPM configuration
├── README.md                   // Project documentation
├── components.json             // Component metadata
├── jest.config.js              // Jest configuration
├── next.config.mjs             // Next.js configuration
├── package-lock.json           // NPM package lock file
├── package.json                // NPM package manifest
├── postcss.config.js           // PostCSS configuration
├── prettier.config.js          // Prettier configuration
├── tailwind.config.ts          // Tailwind CSS configuration
└── tsconfig.json               // TypeScript configuration
└── ...
```
