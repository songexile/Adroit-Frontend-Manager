import type { NextApiRequest, NextApiResponse } from 'next'
import { Resend } from 'resend'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { message } = req.body
  // const { message, deviceData } = req.body

  const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY_MINE)

  try {
    const emailData = await resend.emails.send({
      from: 'EMAIL DEV TEST <bagong@miguelemmara.me>',
      to: 'm.miguelemmara@gmail.com',
      subject: 'Hello from Next.js',
      html: `<h1>${message}</h1>`,
    })

    console.log('Email sent successfully:', emailData)
    res.status(200).json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ message: 'Error sending email' })
  }
}
