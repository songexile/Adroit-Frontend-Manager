# Installation

## Requirements

Before you begin, ensure that your computer has the following software installed.

`nodejs` (18.15.0 or later) https://nodejs.org/en
<br>
`pnpm` Node package manager https://pnpm.io/ (recommended)
<br>
`Visual Studio Code` https://code.visualstudio.com/ (recommended)

## Cloning the repo

You can clone the repo from this URL

```
git clone https://github.com/songexile/Adroit-Frontend-Manager
```

and then `cd` into that folder

```
cd Adroit-Frontend-Manager
```

## Installation (Front End)

**`cd` into frontend folder**

```
cd iot-frontend
```

Before initiating the installation process, ensure all required environment variables are added.

### Setting Environment Variables

Open your terminal, navigate to the root directory of the project and execute the following command:

```
cp .env.example .env.development
```

This command copies the provided example file for local environment variables. Now, proceed to fill in the values for the following environmental variables in the newly created .env.development file:

**# App Environment Variables**

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SECRET` | This is a secret key used for securing various parts of the application. |
| `NEXT_PUBLIC_COGNITO_CLIENT_ID` | Cognito client ID for your application. Obtain this from your AWS Cognito console. |
| `NEXT_PUBLIC_USER_POOL_ID` | The ID of your Cognito user pool. This is needed to identify which user pool your application is using. |
| `NEXT_PUBLIC_COGNITO_ISSUER` | The URL for your Cognito identity provider. |
| `NEXT_PUBLIC_COGNITO_CLIENT_SECRET` | The client secret for your Cognito application, necessary for authentication. For more info, see [Next Auth JS With AWS Cognito](https://next-auth.js.org/providers/cognito). |
| `NEXTAUTH_URL` | Should be set to your project's base URL. During development, it commonly defaults to `http://localhost:3000`. However, in a production environment, ensure to update it to match the URL of your deployed application. |
| `NEXT_PUBLIC_BASE_URL` | Similar to `NEXTAUTH_URL`, should be set to your project's base URL. During development, it commonly defaults to `http://localhost:3000`. |
| `NEXT_PUBLIC_RESEND_API_KEY_MINE` | API key for Resend, a service for sending emails. Replace this with your API key obtained from Resend. |

Once you've completed the aforementioned steps, you can execute the following commands in the terminal/command prompt from the project's root directory.

| Command        | Description                                                                                                                                                              |
| -------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `pnpm install` | This process will install all the necessary dependencies into the node_modules folder.                                                                                   |
| `pnpm dev`     | It launches the project locally, initiates the development server, and monitors any changes in your code. You can access the development server at http://localhost:3000 |

Congratulations!! You have successfully run the project. Visit http://localhost:3000/ (opens new window)to check it in your browser.
