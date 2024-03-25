import type { NextApiRequest, NextApiResponse } from 'next'
import ReactDOMServer from 'react-dom/server'
import { EmailTemplate } from '../../components/EmailTemplate'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async (req: NextApiRequest, res: NextApiResponse) => {
  // const reactElement = <EmailTemplate firstName="John" />
  // const renderedHTML = ReactDOMServer.renderToStaticMarkup(reactElement)

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['munishk686@gmail.com'],
    subject: 'Hello world',
    text: 'hello world',
  })

  if (error) {
    return res.status(400).json(error)
  }

  res.status(200).json(data)
}
