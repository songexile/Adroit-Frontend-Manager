import Link from 'next/link';
import Image from "next/image";
import AdroitImage from "@/public/assets/img/adroit_frontendblur.png";
import AutLoge from '@/public/assets/img/AUT_Logo_New.jpg';


export default function Hero() {
  return (
    <section className="relative">
      {/* Illustration behind hero content */}
      <div className="absolute md:left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1" aria-hidden="true">
        <svg width="1360" height="578" viewBox="0 0 1360 578" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="illustration-01">
              <stop stopColor="#FFF" offset="0%" />
              <stop stopColor="#EAEAEA" offset="77.402%" />
              <stop stopColor="#DFDFDF" offset="100%" />
            </linearGradient>
          </defs>
          <g fill="url(#illustration-01)" fillRule="evenodd">
            <circle cx="1232" cy="128" r="128" />
            <circle cx="155" cy="443" r="64" />
          </g>
        </svg>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <Image
              alt="Logo of AUT"
              src={AutLoge}
              width={200}
              height={200}
              style={{ width: '90px', height: 'auto' }}
              priority={true}
            />
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4" data-aos="zoom-y-out">Adroit  <span className="bg-clip-text text-transparent bg-gradient-to-b from-cyan-500 to-blue-500 ">Frontend Manager</span></h1>
            <div className="max-w-3xl mx-auto">
              <p className="text-xl text-gray-600 mb-8" data-aos="zoom-y-out" data-aos-delay="150">An application which allows monitoring of IoT Devices.</p>
              <div className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center" data-aos="zoom-y-out" data-aos-delay="300">
                <div>
                  <Link className="btn p-4 px-16 rounded-md border-b-2 border-blue-200 shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0" href="/api/auth/signin">Login</Link>
                </div>
              </div>
            </div>
          </div>

          <Image src={AdroitImage} alt="Adroit Frontend" className="p-1 shadow-lg rounded-md bg-gradient-to-r from-cyan-100 to-gray-100" />

          <section className="flex-col flex items-center mt-16  gap-4">
            <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-cyan-500 to-blue-500 hover:text-blue-500 transition-all  text-5xl  md:text-6xl font-extrabold leading-tighter tracking-tighter   px-32 py-2  border-b-4 border-blue-500">Featuring</h1>
            <div className="flex flex-col list-disc items-start gap-4 text-2xl md:text-3xl  leading-tighter tracking-tighter">
              <div className='flex flex-col gap-1'>
                <h1>Realtime reporting of offline devices</h1>
                <h1 className='text-md md:text-xl font-light'> Using AWS S3, Lambda, API Gateway</h1>

              </div>
              <div className='flex flex-col gap-1'>
                <h1>Email integration for reporting devices</h1>
                <h1 className='text-md md:text-xl font-light'> Fire off emails straight from the app, with one-click CC and BCC capabilities</h1>
              </div>
              <div className='flex flex-col gap-1'>
                <h1> Statisics monitoring</h1>
                <h1 className='text-md md:text-xl font-light'> Gain deep insights into every device's performance through data visualizations  formatted text reports</h1>

              </div>
            </div>
          </section>

          <section className="flex-col flex items-center mt-16  text-center  gap-4">
            <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-cyan-500  to-blue-500 hover:text-blue-500 transition-all  text-3xl  md:text-4xl font-extrabold leading-tighter tracking-tighter   px-32 py-2   border-blue-500">Additional information</h1>
            <h1 className='md:w-1/2'>The project was initially conceived and undertaken as a research and development endeavor by students at
              <span className='font-bold'> Auckland University of Technology </span> during the academic year spanning August 2023 to July 2024.</h1>
            <div className='flex gap-1'>
              <h1 className='font-bold  '>Credits:</h1>
              <a className='hover:text-blue-500 transition-all' href='https://github.com/munishk686'>
                Munish Kumar,
              </a>
              <a className='hover:text-blue-500 transition-all' href='https://github.com/songexile'>
                Otis Wales,
              </a>
              <a className='hover:text-blue-500 transition-all' href='https://github.com/MiguelEmmara-ai'>
                Miguel Emmara
              </a>
              <h1>and</h1>
              <a className='hover:text-blue-500 transition-all' href='https://github.com/Glennpgp'>
                Glenn Neil
              </a>
            </div>



          </section>
        </div>
      </div>
    </section>
  );
}
