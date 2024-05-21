# Scripts

Following scripts inside the `package.json` (root dir): 

```json
  "scripts": {
	  "dev": "cd ./iot-frontend && pnpm i && pnpm dev",
	  "build": "cd ./iot-frontend && pnpm i && pnpm build && pnpm start",
	  "docs:dev": "cd ./Documentation && pnpm i && pnpm docs:dev",
	  "test": "cd ./iot-frontend && pnpm test"
	},
```
Following scripts inside the `iot-frontend/package.json`:

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
  },
```