# Next Auth

## Next Auth with AWS Cognito

This project uses Next Auth authentication and AWS Cognito, providing a robust and flexible authentication solution for the project. With Next Auth and AWS Cognito, you can easily implement authentication features and manage user sessions with minimal effort.

## Configuration

To configure Next Auth with AWS Cognito, follow these steps:

1. Open the `iot-frontend/src/pages/api/auth/[...nextauth].ts` file.
2. Configure the Cognito provider by providing the necessary environment variables:

```ts
CognitoProvider({
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string,
  clientSecret: process.env.NEXT_PUBLIC_COGNITO_CLIENT_SECRET as string,
  issuer: process.env.NEXT_PUBLIC_COGNITO_ISSUER,
  idToken: true,
  authorization: {
    params: {
      scope: "phone openid profile email aws.cognito.signin.user.admin",
    },
  },
}),
```

Make sure to set the following environment variables in your `.env.development` file:

`NEXT_PUBLIC_COGNITO_CLIENT_ID`: Your AWS Cognito client ID.
`NEXT_PUBLIC_COGNITO_CLIENT_SECRET`: Your AWS Cognito client secret.
`NEXT_PUBLIC_COGNITO_ISSUER`: The URL of your Cognito identity provider.

3. Customize the Next Auth callbacks to handle user data and session information:

```ts
callbacks: {
  async signIn({ user, profile }) {
    // Customize user data based on the Cognito profile
    // ...
  },
  async session({ session, token }): Promise<CustomSession> {
    // Customize session data based on the token
    // ...
  },
  async jwt({ token, user, account }) {
    // Customize JWT token data
    // ...
  },
},
```

4. Configure additional Next Auth options as needed, such as the theme and secret:

```ts
theme: {
  colorScheme: "dark",
  brandColor: "#000",
  logo: "https://assets.adroit.nz/wp-content/uploads/2022/03/01113543/Adroit-environmental-monitoring.png",
  buttonText: "#fff",
},
secret: process.env.NEXT_PUBLIC_SECRET,
debug: process.env.NODE_ENV === "development",
```

## Usage

To use Next Auth in your application, you can utilize the `useAuth` hook provided in `iot-frontend/src/hooks/useAuth.ts`:

```ts
import { useAuth } from '@/hooks/useAuth';

const MyComponent = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingIndicator />;
  }

  if (isAuthenticated) {
    return (
      <>
        <SEO title={title} description={description} />
        <Header />
        {/* Protected content */}
      </>
    );
  }

  // Render unauthenticated content
};
```

The `useAuth` hook provides the following properties:
<br>
<br>
`session`: The current user session data.
<br>
`status`: The authentication status (`authenticated`, `unauthenticated`, or `loading`).
<br>
`isAuthenticated`: A boolean indicating if the user is authenticated.
<br>
`isUnauthenticated`: A boolean indicating if the user is not authenticated.
<br>
`isLoading`: A boolean indicating if the authentication status is being loaded.
<br>

You can use these properties to conditionally render content based on the user's authentication status.

That's it! You now have a basic understanding of how Next Auth.