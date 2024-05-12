# Profile Page

The profile page allows authenticated users to view and update their profile information. It is located at `iot-frontend/src/pages/profile/index.tsx`.

## Authentication

The profile page requires authentication. It uses the `useAuth` hook to check the authentication status and retrieve the user session.

```tsx
const { isAuthenticated, session, isLoading } = useAuth();
```

If `isLoading` is `true`, a loading indicator is displayed. If `isAuthenticated` is `true`, the profile page content is rendered. If `isAuthenticated` is `false`, the user is redirected to the login screen.

## State Management

The profile page uses the `useState` hook to manage the state of the user's profile information.

```tsx
const [givenName, setGivenName] = useState<string>('');
const [familyName, setFamilyName] = useState<string>('');
const [email, setEmail] = useState<string>('');
```

It also manages the loading state of the form submission.

```tsx
const [isSubmitLoading, setIsSubmitLoading] = useState(false);
```

## Updating User Attributes

The `handleUpdateAttribute` function is responsible for updating the user's attributes in AWS Cognito.

```tsx
const handleUpdateAttribute = async (
  attributeName: string,
  attributeValue: string
) => {
  // ...
  const client = new CognitoIdentityProviderClient({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
    },
  });

  const accessToken = (session as CustomSession).accessToken;

  const command = new UpdateUserAttributesCommand({
    UserAttributes: [
      {
        Name: attributeName,
        Value: attributeValue,
      },
    ],
    AccessToken: accessToken,
  });

  await client.send(command);
  // ...
};
```

It uses the AWS SDK to create a `CognitoIdentityProviderClient` and sends an `UpdateUserAttributesCommand` with the updated attribute values.

## Form Submission

The `handleSubmit` function is called when the user submits the profile update form.

```tsx
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  setIsSubmitLoading(true);

  try {
    await handleUpdateAttribute('given_name', givenName);
    await handleUpdateAttribute('family_name', familyName);
    await handleUpdateAttribute('email', email);
    showToast({
      message: 'Attributes were successfully updated.',
      type: 'success',
    });
    setIsSubmitLoading(false);
  } catch (error: any) {
    showToast({
      message: 'Error updating user attributes: ' + error.message,
      type: 'error',
    });
  } finally {
    setIsSubmitLoading(false);
  }
};
```

It calls the `handleUpdateAttribute` function for each attribute and shows a success or error toast message based on the result. It also manages the loading state of the form submission.

## Rendering

The profile page conditionally renders the content based on the authentication status and loading state.

```tsx
if (isLoading) {
  return <LoadingIndicator />;
}

if (isAuthenticated) {
  return (
    <>
      <Header />
      {/* Profile form */}
      <Footer />
    </>
  );
} else {
  return <LoginScreen />;
}
```

If `isLoading` is `true`, a loading indicator is displayed. If `isAuthenticated` is `true`, the profile form is rendered along with the header and footer components. If `isAuthenticated` is `false`, the user is redirected to the login screen.

## Conclusion

The profile page allows authenticated users to view and update their profile information using AWS Cognito. It provides a user-friendly form to edit the user's given name, family name, and email address. The page handles form submission, updates the user attributes in Cognito, and displays success or error messages accordingly.
