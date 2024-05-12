# React Mail (Resend)

## Overview

This documentation outlines the functionality of the `/api/resend` endpoint, part of a Next.js application designed to facilitate the sending of emails with personalized and device-specific information. The endpoint uses the `Resend` library to manage email dispatches.

## Endpoint Details

### Endpoint: `/api/resend`

### HTTP Method: POST

### Description

This API endpoint allows for sending emails that can include dynamic HTML content based on the recipient's device data. It supports sending emails with `cc` (carbon copy) and `bcc` (blind carbon copy) options.

### Request Headers

- **Content-Type**: `application/json` - Indicates that the body of the request is JSON.

### Request Body Schema

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

## Fields Description

- **to (required)**: The primary recipient's email address.
- **cc (optional)**: One or more email addresses to receive a carbon copy of the email.
- **bcc (optional)**: One or more email addresses to receive a blind carbon copy of the email.
- **subject (required)**: The subject line of the email.
- **message (required)**: The main content of the email.
- **deviceData (optional)**: Additional device-specific information to be included in the email.

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

This response indicates an unexpected error occurred during the process of sending the email.
Sample Code Snippet
The following is a sample handler function for the /api/resend endpoint:

```ts
import { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';
import { EmailRequestBody } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { to, cc, bcc, subject, message, deviceData }: EmailRequestBody =
    req.body;

  if (!to || !subject || !message) {
    return res
      .status(400)
      .json({ message: 'To, Subject, and Message are required' });
  }

  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY_MINE);

  try {
    const emailData = await resend.emails.send({
      from: 'Adroit Ticketing <noreply@miguelemmara.me>',
      to,
      cc,
      bcc,
      subject,
      html: '<h1>Custom HTML Content Here</h1>',
    });

    console.log('Email sent successfully:', emailData);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Error sending email' });
  }
}
```

### Conclusion

The /api/resend endpoint provides robust functionality for sending customized emails using a secure and efficient method. It is essential for users to provide valid data for all required fields to ensure successful email delivery.
