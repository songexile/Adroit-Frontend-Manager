# Create Ticket Page

The Create Ticket page allows users to create a new ticket for a specific device. It is located at `iot-frontend/src/pages/create-ticket/[createTicket].tsx`.

## Authentication

Similar to other pages, the Create Ticket page requires authentication. It uses the `useAuth` hook to check the authentication status.

```tsx
const { isAuthenticated, isLoading } = useAuth();
```

If `isLoading` is `true`, a loading indicator is displayed. If `isAuthenticated` is `false`, the user is redirected to the login page.

## Fetching Device ID

The `fetchDeviceId` function is used to fetch the device ID from the URL.

```tsx
function fetchDeviceId() {
  const pathname = usePathname();
  const parts = pathname ? pathname.split('/') : [];
  const deviceId = parts[parts.length - 1]
    ? parseInt(parts[parts.length - 1] as string)
    : 0;
  return deviceId;
}
```

The device ID is extracted from the URL and parsed as an integer. If the device ID is undefined, it defaults to 0.

## Email Validation

The Create Ticket page includes email validation functions to ensure valid email formats.

```tsx
const isEmail = (email: string) =>
  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email);

const isValidEmails = (emails: string) => {
  const emailArray = emails.split(',').map((email) => email.trim());
  return emailArray.every(isEmail);
};
```

The `isEmail` function checks if a single email address is in a valid format, while the `isValidEmails` function validates a comma-separated list of email addresses.

## State Management

The Create Ticket page uses the `useState` hook to manage the state of various form fields and other variables.

```tsx
const [to, setTo] = useState('');
const [cc, setCc] = useState('');
const [bcc, setBcc] = useState('');
const [subject, setSubject] = useState('');
const [message, setMessage] = useState(
  'Hi team, There is something wrong with...'
);
const [isSubmitLoading, setIsSubmitLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [errors, setErrors] = useState<{ [key: string]: string }>({});
```

These state variables store the values of the email fields (to, cc, bcc, subject, message), loading state, modal visibility, and form errors.

## Handling Create Ticket

The `handleCreateTicket` function is called when the user submits the create ticket form.

```tsx
const handleCreateTicket = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // Reset errors
  setErrors({});
  setIsSubmitLoading(true);

  // Validate fields
  const validationErrors: { [key: string]: string } = {};
  // ... field validation logic ...

  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    setIsSubmitLoading(false);
    return;
  }

  try {
    const response = await fetch('/api/sendEmail', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, cc, bcc, subject, message, deviceData }),
    });

    if (response.ok) {
      // Show success modal
      setShowModal(true);
    } else {
      // Handle error responses
      // ...
    }
  } catch (error) {
    // Handle errors
    // ...
  } finally {
    setIsSubmitLoading(false);
  }
};
```

The function performs the following steps:

1. Prevents the default form submission behavior.
2. Resets any previous errors.
3. Sets the loading state to `true`.
4. Validates the form fields and sets validation errors if any.
5. If there are validation errors, updates the errors state and sets the loading state back to `false`.
6. If there are no validation errors, sends a POST request to the `/api/sendEmail` endpoint with the form data.
7. Handles the response from the API, showing a success modal if the response is successful, or handling error responses appropriately.
8. Catches any errors that occur during the process and handles them accordingly.
9. Finally, sets the loading state back to `false`.

## Using Resend for Email Sending

The Create Ticket page uses the Resend service for sending emails. Refer to the [Resend Documentation](/integrations/resend.html) for more details on how Resend is integrated into the application.
