import { EmailRequestBody } from '@/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { to, cc, bcc, subject, message, deviceData }: EmailRequestBody = req.body

  // Validate required fields
  if (!to || !subject || !message) {
    return res.status(400).json({ message: 'To, Subject, and Message are required' })
  }

  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY_MINE)

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
          <li><strong>Last Online:</strong> ${typeof deviceData?.last_online === 'string' ? deviceData.last_online : deviceData?.last_online?.value || 'N/A'}</li>
        </ul>
      `,
    })

    console.log('Email sent successfully:', emailData)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Error sending email' })
  }
}
