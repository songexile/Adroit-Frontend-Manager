# Build and Deploy Documentation

This documentation provides an overview of the build and deploy process for the Adroit Manager Frontend project. `Next JS 14.`

## Build Scripts

The project uses the following build scripts defined in the `package.json` files:

### Root `package.json`

```json
"scripts": {
  "dev": "cd ./iot-frontend && pnpm i && pnpm dev",
  "build": "cd ./iot-frontend && pnpm i && pnpm build && pnpm start",
  "docs:dev": "cd ./Documentation && pnpm i && pnpm docs:dev",
  "test": "cd ./iot-frontend && pnpm test"
}
```

- `dev`: Installs dependencies and starts the development server for the `iot-frontend` project.
- `build`: Installs dependencies, builds the `iot-frontend` project, and starts the production server.
- `docs:dev`: Installs dependencies and starts the development server for the documentation.
- `test`: Runs tests for the `iot-frontend` project.

### `iot-frontend/package.json`

```json
"scripts": {
  "dev": "next dev",
  "dev:ssl": "next dev --experimental-https",
  "build": "next build",
  "start": "next start",
  "lint": "next lint",
  "test": "jest --watchAll",
  "test:ci": "jest --ci",
  "clear-jest-cache": "jest --clearCache"
}
```

- `dev`: Starts the Next.js development server.
- `dev:ssl`: Starts the Next.js development server with experimental HTTPS support.
- `build`: Builds the Next.js project for production.
- `start`: Starts the Next.js production server.
- `lint`: Runs ESLint for code linting.
- `test`: Runs Jest tests in watch mode.
- `test:ci`: Runs Jest tests in CI mode.
- `clear-jest-cache`: Clears the Jest cache.

## Deployment

The project is deployed on AWS Amplify using two branches: `main` and `staging`. The project is connected to our GitHub repo: [Adroit Manager Frontend](https://github.com/songexile/Adroit-Frontend-Manager)

### Links

- Staging website: e.g., rnd-staging.adroitplatform.com
- Production website: e.g., rnd.adroitplatform.com

### Environment Settings

The AWS Amplify deployment uses different environment settings for each branch. The following environment variables are set:

```
Variable: AMPLIFY_DIFF_DEPLOY
Value: false
Branch: All branches

Variable: AMPLIFY_MONOREPO_APP_ROOT
Value: iot-frontend
Branch: All branches

Variable: NEXT_PUBLIC_AWS_ACCESS_KEY_ID
Value: *****************************
Branch: All branches

Variable: NEXT_PUBLIC_AWS_REGION
Value: ap-southeast-2
Branch: All branches

Variable: NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY
Value: *****************************
Branch: All branches

Variable: NEXT_PUBLIC_RESEND_API_KEY_MINE
Value: *****************************
Branch: All branches

Variable: NEXT_PUBLIC_RESEND_API_KEY_MUNISH
Value: *****************************
Branch: All branches

Variable: NEXT_PUBLIC_SECRET
Value: *****************************
Branch: All branches

Variable: NEXTAUTH_URL
Value: https://yourdomain.com
Branch: main

Variable: NEXT_PUBLIC_BASE_URL
Value: https://yourdomain.com
Branch: main

Variable: NEXT_PUBLIC_COGNITO_CLIENT_ID
Value: *****************************
Branch: main

Variable: NEXT_PUBLIC_COGNITO_CLIENT_SECRET
Value: *****************************
Branch: main

Variable: NEXT_PUBLIC_COGNITO_ISSUER
Value: *****************************
Branch: main

Variable: NEXT_PUBLIC_USER_POOL_ID
Value: *****************************
Branch: main

Variable: NEXTAUTH_URL
Value: https://test-yourdomain.com
Branch: staging

Variable: NEXT_PUBLIC_BASE_URL
Value: https://test-yourdomain.com
Branch: staging

Variable: NEXT_PUBLIC_COGNITO_CLIENT_ID
Value: *****************************
Branch: staging

Variable: NEXT_PUBLIC_COGNITO_CLIENT_SECRET
Value: *****************************
Branch: staging

Variable: NEXT_PUBLIC_COGNITO_ISSUER
Value: *****************************
Branch: staging

Variable: NEXT_PUBLIC_USER_POOL_ID
Value: *****************************
Branch: staging
```

### Amplify Configuration

The AWS Amplify configuration is defined in the `amplify.yml` file:

```yaml
version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - curl -fsSL https://get.pnpm.io/install.sh | sh -
            - source /root/.bashrc
            - npm install -g pnpm
            - pnpm install
            - echo "- env | grep -e NEXTAUTH_ >> .env"
            - echo "- env | grep -e NEXT_PUBLIC_NEXTAUTH_ >> .env"
            - env | grep -e NEXT_PUBLIC_ >> .env
            - env | grep -e NEXT_PUBLIC_ >> .env.production
            - env | grep -e NEXTAUTH_ >> .env
            - env | grep -e NEXTAUTH_ >> .env.production
        build:
          commands:
            - pnpm run build
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths:
          - .next/cache/**/*
          - node_modules/**/*
      appRoot: iot-frontend
```

The `preBuild` phase installs dependencies and sets up the environment variables. The `build` phase runs the `pnpm run build` command to build the project. The `artifacts` section specifies the build output directory (`.next`) and files to include. The `cache` section defines the paths to cache for faster subsequent builds.

## Conclusion

This documentation provides an overview of the build and deploy process for the Adroit Manager Frontend project. It covers the build scripts defined in the `package.json` files, the deployment setup on AWS Amplify with different branches and environment settings, and the Amplify configuration in the `amplify.yml` file.
