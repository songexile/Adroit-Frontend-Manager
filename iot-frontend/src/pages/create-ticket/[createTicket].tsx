import Header from '@/components/Header';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Resend } from 'resend';

const Devices = () => {
  const router = useRouter();
  const { deviceID, clientName, deviceKey, lastOnline, data } = router.query;
  const deviceData = data ? JSON.parse(data as string) : null;

  const [message, setMessage] = useState('');

  // Temp Data
  const statusData = [
    { type: 'Scan', status: 'ONLINE' },
    { type: 'Battery', status: 'OFFLINE' },
    { type: 'Insitu', status: 'ERROR' },
  ];

  const resend = new Resend("re_DkWgqBEQ_8m2JGCHeztZWUZRrZc1BBuwE");

  const sendEmail = async () => {
    try {
      const emaildata = await resend.emails.send({
        from: 'next@zenorocha.com',
        to: 'munishk686@gmail.com',
        subject: 'Hello from Next.js',
        html: `<h1>${message}</h1>`,
      });
      console.log('Email sent successfully:', emaildata);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  };

  //const handleMessageChange = (e) => {
    //setMessage(e.target.textContent);
  //};

  const handleSendMessage = () => {
    sendEmail();
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100">
        <div className="container mx-auto">
          <p className="text-black-600 text-center mt-2 flex justify-center">Email will be sent to support@adroit.co.nz</p>

          <div className="mx-auto py-8">
            <div className="flex justify-center mb-4 bg-white text-black px-3 py-1 rounded-lg items-center">
              <span className="text-4xl font-semibold mr-2">Subject: Device Issue:</span>
              <span className="px-4">XXRU2</span>
            </div>

            <p className="mt-2 font-semibold">Message:</p>

            <div
              className="border border-gray-300 p-2 rounded-md bg-white"
              contentEditable="true"
              style={{ outline: 'none', width: '500px', height: '100px', minWidth: '100px', minHeight: '50px' }}
             // onInput={handleMessageChange}
            ></div>

            <div className="mt-6 flex justify-center">
              <button className="bg-green-500 text-white font-bold py-2 px-4 rounded" onClick={handleSendMessage}>
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Devices;
