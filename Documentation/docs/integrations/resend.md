# React Mail (Resend)

## Sending Emails with Resend

Adroit FrontEnd manager integrates with Resend, a powerful email sending service, to enable sending emails from your Next.js application. The `iot-frontend/src/pages/api/sendEmail.ts` file handles the email sending functionality.

## Configuration

To configure email sending with Resend, follow these steps:

Sign up for a Resend account at https://resend.com and obtain your API key.
Set the `NEXT_PUBLIC_RESEND_API_KEY_MINE` environment variable in your `.env.development` file with your Resend API key.

## API Endpoint

The `/api/sendEmail `endpoint is responsible for handling email sending requests. It accepts a POST request with the following parameters in the request body:
<br>

`to` (required): The email address(es) of the recipient(s).
<br>
`cc` (optional): The email address(es) for the carbon copy recipients.
<br>
`bcc` (optional): The email address(es) for the blind carbon copy recipients.
<br>
`subject` (required): The subject of the email.
<br>
`message` (required): The plain text content of the email.
<br>
`deviceData` (optional): An object containing device information to be included in the email.

## Usage

To send an email, make a POST request to the `/api/sendEmail` endpoint with the required parameters in the request body. Here's an example usage:

```ts
try {
  const response = await fetch('/api/sendEmail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to,
      cc,
      bcc,
      subject,
      message,
      deviceData,
    }),
  });

  if (response.ok) {
    // Show success modal
    setShowModal(true);
  } else {
    const data = await response.json();
    if (data.message === 'Invalid API key') {
      showToast({ message: 'Invalid API key', type: 'error' });
    } else {
      showToast({
        message: `Error creating ticket: ${data.message}`,
        type: 'error',
      });
    }
  }
} catch (error) {
  if (error instanceof Error) {
    showToast({
      message: `Error creating ticket: ${error.message}`,
      type: 'error',
    });
  } else {
    showToast({
      message: 'Unknown error occurred while creating ticket',
      type: 'error',
    });
  }
} finally {
  setIsSubmitLoading(false);
}
```

# Error Handling

The API endpoint handles the following error scenarios:

- If the request method is not POST, it returns a 405 status code with an error message.
<br>
- If the required fields (`to`, `subject`, `message`) are missing, it returns a 400 status code with an error message.
<br>
- If there is an error sending the email (e.g., invalid API key), it returns a 500 status code with an error message.

## Email Template

The email sent by the API endpoint includes the following information:

- The subject of the email.
<br>
- The plain text message.
<br>
- Device information (if provided), including:
    - Device ID
    - Device Key
    - Client Name
    - Last Online timestamp
    - Link to the device info page

The email template is defined in the `html` property of the `resend.emails.send` method.

You now have a basic understanding of how email sending is implemented using Resend in project. Feel free to explore the code further and customize it to fit your specific requirements.
