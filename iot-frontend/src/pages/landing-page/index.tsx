import Link from "next/link";
import Image from "next/image";
import AdroitImage from "@/public/assets/img/adroit_frontendblur.png";
import AutLoge from "@/public/assets/img/AUT_Logo_New.jpg";

export default function Hero() {
  return (
    <section className="relative">
      {/* The Grid */}
      <div className="relative z-10">
        <div className="absolute inset-x-0 top-1/2 -z-10 flex -translate-y-1/2 justify-center overflow-hidden [mask-image:radial-gradient(50%_45%_at_50%_55%,white,transparent)]">
          <svg
            className="h-[60rem] w-[100rem] flex-none stroke-blue-600 opacity-20"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="e9033f3e-f665-41a6-84ef-756f6778e6fe"
                width="200"
                height="200"
                x="50%"
                y="50%"
                patternUnits="userSpaceOnUse"
                patternTransform="translate(-100 0)"
              >
                <path d="M.5 200V.5H200" fill="none"></path>
              </pattern>
            </defs>
            <svg x="50%" y="50%" className="overflow-visible fill-blue-50">
              <path
                d="M-300 0h201v201h-201Z M300 200h201v201h-201Z"
                stroke-width="0"
              ></path>
            </svg>
            <rect
              width="100%"
              height="100%"
              stroke-width="0"
              fill="url(#e9033f3e-f665-41a6-84ef-756f6778e6fe)"
            ></rect>
          </svg>
        </div>
      </div>

      {/* Illustration behind hero content */}
      <div
        className="absolute md:left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1"
        aria-hidden="true"
      >
        <svg
          className="hidden md:block"
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
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

      {/* <div
        className="absolute md:left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1"
        aria-hidden="true"
      >
        {" "}
        <svg
          width="1360"
          height="578"
          viewBox="0 0 1360 578"
          xmlns="http://www.w3.org/2000/svg"
        >
          {" "}
          <defs>
            {" "}
            <linearGradient
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              id="illustration-01"
            >
              {" "}
              <stop stopColor="#FFF" offset="0%" />{" "}
              <stop stopColor="#EAEAEA" offset="77.402%" />{" "}
              <stop stopColor="#DFDFDF" offset="100%" />{" "}
            </linearGradient>{" "}
          </defs>{" "}
          <g fill="url(#illustration-01)" fillRule="evenodd">
            {" "}
            <circle cx="1232" cy="128" r="128" />{" "}
            <circle cx="155" cy="443" r="64" />{" "}
          </g>{" "}
        </svg>{" "}
      </div> */}

      <div className="max-w-6xl  mx-auto px-4 sm:px-6">
        {/* Hero content */}
        <div className="pt-32 pb-12 md:pt-40 md:pb-20">
          {/* Section header */}
          <div className="text-center pb-12 md:pb-16">
            <h1
              className="text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4"
              data-aos="zoom-y-out"
            >
              Adroit{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-b from-cyan-500 to-blue-500">
                Frontend Manager
              </span>
            </h1>
            <div className="flex justify-center">
              <Image
                alt="Logo of AUT"
                src={AutLoge}
                width={250}
                height={250}
                style={{ width: "150px", height: "auto" }}
                priority={true}
                className="flex flex-col items-center justify-center"
              />
            </div>
            <div className="max-w-3xl mx-auto mt-3">
              <p
                className="text-xl text-gray-600 mb-8"
                data-aos="zoom-y-out"
                data-aos-delay="150"
              >
                An application which allows monitoring of IoT Devices.
              </p>
              <div
                className="max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center"
                data-aos="zoom-y-out"
                data-aos-delay="300"
              >
                <div>
                  <Link
                    className="btn p-4 px-16 rounded-md border-b-2 border-blue-200 shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0"
                    href="/api/auth/signin"
                  >
                    Login
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Dashboard Sample */}
          <Image
            src={AdroitImage}
            alt="Adroit Frontend"
            className="p-1 shadow-lg rounded-md bg-gradient-to-r from-cyan-100 to-gray-100"
          />

          {/* Featuring */}
          <section className="flex flex-col items-center mt-16 gap-4">
            <h1 className="bg-clip-text text-transparent bg-gradient-to-b from-cyan-500 to-blue-500 hover:text-blue-500 transition-all text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter px-4 sm:px-16 md:px-32 py-2 border-b-2 sm:border-b-4 border-blue-500">
              Featuring
            </h1>
            <div className="flex flex-col list-disc items-start gap-4 text-xl sm:text-2xl md:text-3xl leading-tighter tracking-tighter px-4 sm:px-8">
              <div className="flex flex-col gap-1">
                <h2>Realtime reporting of offline devices</h2>
                <p className="text-lg md:text-xl font-light">
                  Using AWS S3, Lambda, API Gateway
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h2>Email integration for reporting devices</h2>
                <p className="text-lg md:text-xl font-light">
                  Fire off emails straight from the app, with one-click CC and
                  BCC capabilities
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <h2>Statistics monitoring</h2>
                <p className="text-lg md:text-xl font-light">
                  Gain deep insights into every device's performance through
                  data visualizations and formatted text reports
                </p>
              </div>
            </div>
          </section>

          {/* Additional information */}
          <section className="flex flex-col items-center mt-16 text-center gap-4">
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tighter tracking-tighter px-4 sm:px-32 py-2 bg-clip-text text-transparent bg-gradient-to-b from-cyan-500 to-blue-500 hover:text-blue-500 transition-all">
              Additional information
            </h1>
            <p className="px-4 sm:px-8 md:w-3/4 lg:w-1/2">
              The project was initially conceived and undertaken as a research
              and development endeavor by students at
              <span className="font-bold">
                {" "}
                Auckland University of Technology{" "}
              </span>{" "}
              during the academic year spanning August 2023 to July 2024.
            </p>
            <div className="flex flex-wrap justify-center gap-1 px-4 sm:px-8">
              <h2 className="font-bold">Credits:</h2>
              <a
                className="hover:text-blue-500 transition-all"
                href="https://github.com/munishk686"
              >
                Munish Kumar,
              </a>
              <a
                className="hover:text-blue-500 transition-all"
                href="https://github.com/songexile"
              >
                Otis Wales,
              </a>
              <a
                className="hover:text-blue-500 transition-all"
                href="https://github.com/MiguelEmmara-ai"
              >
                Miguel Emmara
              </a>
              <span>and</span>
              <a
                className="hover:text-blue-500 transition-all"
                href="https://github.com/Glennpgp"
              >
                Glenn Neil
              </a>
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
