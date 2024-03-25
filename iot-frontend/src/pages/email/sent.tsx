import { Resend } from 'resend'

export default function Home() {

const resend = new Resend('re_DkWgqBEQ_8m2JGCHeztZWUZRrZc1BBuwE')

   resend.emails.send({
    from: 'next@zenorocha.com',
    to: 'munishk686@gmail.com',
    subject: 'Hello from Next.js',
    text: 'this is text email'
  });

  return (
    <div>
     
    </div>
  );
}
