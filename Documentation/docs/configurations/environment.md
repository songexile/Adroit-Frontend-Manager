# Environment

**# Next.js Public Environment Variables**
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
