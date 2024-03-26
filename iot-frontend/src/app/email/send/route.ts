//import { EmailTemplate } from '../../../components/EmailTemplate';
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['munishk686@gmail.com'],
      subject: 'Hello world',
      text: 'Hello world',
    })

    return Response.json(data)
  } catch (error) {
    return Response.json({ error })
  }
}
