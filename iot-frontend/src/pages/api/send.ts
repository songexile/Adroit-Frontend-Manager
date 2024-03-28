import type { NextApiRequest, NextApiResponse } from 'next'
import { EmailTemplate } from '../../components/EmailTemplate'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['munishk686@gmail.com'],
      subject: 'Hello world',
      react: EmailTemplate({ firstName: 'John' }),
      text: `Welcome, John!`, // Add the text property
    })

    if (error) {
      res.status(400).json({ error })
    }

    res.status(200).json({ data })
  } catch (error) {
    res.status(400).json({ error })
  }
}
