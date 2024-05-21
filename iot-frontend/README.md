# Adroit Manager Frontend - Frontend

This is the frontend application for the Adroit Manager Frontend, built with Next.js.

## Getting Started

To run the frontend application locally, follow these steps:

1. Install the dependencies: `pnpm install`
2. Configure the necessary environment variables (see below)
3. Start the development server: `pnpm dev`
4. Open the application in your browser at `http://localhost:3000`

## Environment Variables

The following environment variables are required to run the frontend application:

- `NEXT_PUBLIC_AWS_ACCESS_KEY_ID`: AWS access key ID
- `NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `NEXT_PUBLIC_AWS_REGION`: Your AWS region
- `NEXT_PUBLIC_COGNITO_CLIENT_ID`: AWS Cognito client ID for authentication
- `NEXT_PUBLIC_COGNITO_CLIENT_SECRET`: AWS Cognito client secret for authentication
- `NEXT_PUBLIC_COGNITO_ISSUER`: AWS Cognito issuer URL for authentication
- `NEXT_PUBLIC_USER_POOL_ID`: AWS Cognito user pool ID for authentication
- `NEXT_PUBLIC_RESEND_API_KEY_MINE`: Resend API key for email sending
- `NEXT_PUBLIC_SECRET`: Secret key for secure communication
- `NEXT_PUBLIC_BASE_URL`: Base URL for the application

Create a `.env.development` (and or `.env.production`) file in the `iot-frontend` directory and add the above environment variables with their corresponding values.

```
cd iot-frontend/
cp .env.example .env.development
```

## Available Scripts

The following scripts are available in the `package.json` file:

- `pnpm dev`: Starts the development server
- `pnpm build`: Builds the application for production
- `pnpm start`: Starts the production server
- `pnpm lint`: Runs the linter to check for code quality issues
- `pnpm test`: Runs the test suite
- `pnpm test:ci`: Runs the test suite in CI mode
- `pnpm clear-jest-cache`: Clears the Jest cache

## Deployment

The frontend application is deployed using AWS Amplify. The deployment process is triggered when changes are pushed to the `main` or `staging` branch on GitHub. The necessary environment variables for deployment are set up in the Amplify console.
