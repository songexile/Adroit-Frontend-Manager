# React Mail (Resend)

This documentation outlines the functionality of the `/api/resend` endpoint, part of a Next.js application designed to facilitate the sending of emails with personalized and device-specific information. The endpoint uses the `Resend` library to manage email dispatches.

## Sending Emails with Resend

Adroit FrontEnd manager integrates with Resend, a powerful email sending service, to enable sending emails from your Next.js application. The `iot-frontend/src/pages/api/sendEmail.ts` file handles the email sending functionality.

## Configuration

To configure email sending with Resend, follow these steps:

Sign up for a Resend account at https://resend.com and obtain your API key.
Set the `NEXT_PUBLIC_RESEND_API_KEY_MINE` environment variable in your `.env.development` file with your Resend API key.

## Endpoint Details

### Endpoint: `/api/resend`

### HTTP Method: POST

## Description

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

## Request Body Schema

The request body must be a JSON object with the following keys:

```json
{
  "to": "string",
  "cc": "string | array",
  "bcc": "string | array",
  "subject": "string",
  "message": "string",
  "deviceData": {
    "device_id": "string",
    "device_key": "string",
    "client_name": "string",
    "last_online": "string | object"
  }
}
```

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

### Success Response

- **Status Code**: `200 OK`
- **Content**:
  ```json
  { "success": true }
  ```

# Indicates that the email was sent successfully

## Error Responses

### Method Not Allowed

- **Status Code**: `405 Method Not Allowed`
- **Content**:

```json
{ "message": "Method not allowed" }
```

This response is returned if the request method is not POST.
Bad Request

Status Code: 400 Bad Request
Content:

```json
{ "message": "To, Subject, and Message are required" }
```

This response is returned if any required fields are missing or if the provided API key is invalid.
Internal Server Error

Status Code: 500 Internal Server Error
Content:

```json
{ "message": "Error sending email" }
```

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

```ts
// iot-frontend/src/pages/api/sendEmail.ts
import { EmailRequestBody } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, cc, bcc, subject, message, deviceData }: EmailRequestBody =
    req.body;

  // Validate required fields
  if (!to || !subject || !message) {
    return res
      .status(400)
      .json({ message: 'To, Subject, and Message are required' });
  }

  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY_MINE);

  try {
    let ccEmails: string[] = [];
    let bccEmails: string[] = [];

    if (typeof cc === 'string') {
      ccEmails = cc.split(',').map((email: string) => email.trim());
    } else if (Array.isArray(cc)) {
      ccEmails = cc.map((email: string) => email.trim());
    }

    if (typeof bcc === 'string') {
      bccEmails = bcc.split(',').map((email: string) => email.trim());
    } else if (Array.isArray(bcc)) {
      bccEmails = bcc.map((email: string) => email.trim());
    }

    const emailData = await resend.emails.send({
      from: 'Adroit Ticketing <noreply@miguelemmara.me>',
      to,
      cc: ccEmails,
      bcc: bccEmails,
      subject,
      html: `
        <h1>${subject}</h1>
        <p>${message}</p>
        <h2>Device Information:</h2>
        <ul>
          <li><strong>Device ID:</strong> ${deviceData?.device_id}</li>
          <li><strong>Device Key:</strong> ${deviceData?.device_key}</li>
          <li><strong>Client Name:</strong> ${deviceData?.client_name}</li>
          <li><strong>Last Online:</strong> ${
            typeof deviceData?.last_online === 'string'
              ? deviceData.last_online
              : deviceData?.last_online?.value || 'N/A'
          }</li>
          <li>
            <strong>Device Info Page Link:</strong>
            <a href="${process.env.NEXT_PUBLIC_BASE_URL}/device-info/${
        deviceData?.device_id
      }" target="_blank" rel="noopener noreferrer">
              View Device Info
            </a>
          </li>
        </ul>
      `,
    });

    if (emailData.error && emailData.error.message === 'API key is invalid') {
      throw new Error('Invalid API key');
    }

    console.log('Email sent successfully:', emailData);
    res.status(200).json({ success: true });
  } catch (error: any) {
    console.error('Error sending email:', error);
    if (error.message === 'Invalid API key') {
      res.status(400).json({ message: 'Invalid API key' });
    } else {
      res.status(500).json({ message: 'Error sending email' });
    }
  }
}
```

## Conclusion

The /api/resend endpoint provides robust functionality for sending customized emails using a secure and efficient method. It is essential for users to provide valid data for all required fields to ensure successful email delivery.
