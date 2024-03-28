import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { to, subject, message, deviceData } = req.body

  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY_MINE)

  try {
    const emailData = await resend.emails.send({
      from: 'EMAIL DEV TEST <noreply@miguelemmara.me>',
      to,
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
