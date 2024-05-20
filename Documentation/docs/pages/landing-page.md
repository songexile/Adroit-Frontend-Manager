# Landing Page

The landing page is the entry point of the Adroit Manager Frontend application. It provides an overview of the application and its features, along with login functionality. The landing page is located at `iot-frontend/src/pages/landing-page/index.tsx`.

## Hero Section

The hero section is the main content of the landing page. It includes the following components:

- A background grid design with a custom SVG pattern.
- An illustration behind the hero content.
- The main heading and subheading.
- A logo image of AUT (Auckland University of Technology).
- A brief description of the application.
- A login button that redirects the user to the authentication page.

```tsx
<section className='relative'>
  {/* The Grid */}
  <div className='relative z-0'>{/* Background SVG */}</div>

  {/* Illustration behind hero content */}
  <div
    className='absolute md:left-1/2 transform -translate-x-1/2 bottom-0 pointer-events-none -z-1'
    aria-hidden='true'
  >
    {/* SVG illustration */}
  </div>

  <div className='max-w-6xl mx-auto px-4 sm:px-6'>
    {/* Hero content */}
    <div className='pt-32 pb-12 md:pt-40 md:pb-20'>
      {/* Section header */}
      <div className='text-center pb-12 md:pb-16'>
        <h1
          className='text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter mb-4'
          data-aos='zoom-y-out'
        >
          Adroit{' '}
          <span className='bg-clip-text text-transparent bg-gradient-to-b from-cyan-500 to-blue-500'>
            Manager Frontend
          </span>
        </h1>
        <div className='flex justify-center'>
          <Image
            alt='Logo of AUT'
            src={AutLoge}
            width={250}
            height={250}
            style={{ width: '150px', height: 'auto' }}
            priority={true}
            className='flex flex-col items-center justify-center'
          />
        </div>
        <div className='max-w-3xl mx-auto mt-3'>
          <p
            className='text-xl text-gray-600 mb-8'
            data-aos='zoom-y-out'
            data-aos-delay='150'
          >
            An application which allows monitoring of IoT Devices.
          </p>
          <div
            className='max-w-xs mx-auto sm:max-w-none sm:flex sm:justify-center'
            data-aos='zoom-y-out'
            data-aos-delay='300'
          >
            <div>
              <Link
                className='btn p-4 px-16 rounded-md border-b-2 border-blue-200 shadow-sm text-white bg-blue-600 hover:bg-blue-700 w-full mb-4 sm:w-auto sm:mb-0'
                href='/api/auth/signin'
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
```

## Dashboard Sample

The landing page includes a sample image of the Adroit Manager Frontend dashboard. It provides a visual representation of what the application looks like.

```tsx
<Image
  src={AdroitImage}
  alt='Adroit Frontend'
  className='p-1 shadow-lg rounded-md bg-gradient-to-r from-cyan-100 to-gray-100'
/>
```

## Featuring Section

The featuring section highlights the key features of the Adroit Manager Frontend application. It includes a heading and a list of features with brief descriptions.

```tsx
<section className='flex flex-col items-center mt-16 gap-4'>
  <h1 className='bg-clip-text text-transparent bg-gradient-to-b from-cyan-500 to-blue-500 hover:text-blue-500 transition-all text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tighter tracking-tighter px-4 sm:px-16 md:px-32 py-2 border-b-2 sm:border-b-4 border-blue-500'>
    Featuring
  </h1>
  <div className='flex flex-col list-disc items-start gap-4 text-xl sm:text-2xl md:text-3xl leading-tighter tracking-tighter px-4 sm:px-8'>
    <div className='flex flex-col gap-1'>
      <h2>Realtime reporting of offline devices</h2>
      <p className='text-lg md:text-xl font-light'>
        Using AWS S3, Lambda, API Gateway
      </p>
    </div>
    <div className='flex flex-col gap-1'>
      <h2>Email integration for reporting devices</h2>
      <p className='text-lg md:text-xl font-light'>
        Fire off emails straight from the app, with one-click CC and BCC
        capabilities
      </p>
    </div>
    <div className='flex flex-col gap-1'>
      <h2>Statistics monitoring</h2>
      <p className='text-lg md:text-xl font-light'>
        Gain deep insights into every device's performance through data
        visualizations and formatted text reports
      </p>
    </div>
  </div>
</section>
```

## Additional Information

The additional information section provides details about the project's conception and the credits to the contributors.

```tsx
<section className='flex flex-col items-center mt-16 text-center gap-4'>
  <h1 className='text-3xl md:text-4xl font-extrabold leading-tighter tracking-tighter px-4 sm:px-32 py-2 bg-clip-text text-transparent bg-gradient-to-b from-cyan-500 to-blue-500 hover:text-blue-500 transition-all'>
    Additional information
  </h1>
  <p className='px-4 sm:px-8 md:w-3/4 lg:w-1/2'>
    The project was initially conceived and undertaken as a research and
    development endeavor by students at
    <span className='font-bold'> Auckland University of Technology </span> during
    the academic year spanning August 2023 to July 2024.
  </p>
  <div className='flex flex-wrap justify-center gap-1 px-4 sm:px-8'>
    <h2 className='font-bold'>Credits:</h2>
    <a
      className='hover:text-blue-500 transition-all'
      target='_blank'
      href='https://github.com/munishk686'
    >
      Munish Kumar,
    </a>
    <a
      className='hover:text-blue-500 transition-all'
      target='_blank'
      href='https://github.com/songexile'
    >
      Otis Wales,
    </a>
    <a
      className='hover:text-blue-500 transition-all'
      target='_blank'
      href='https://github.com/MiguelEmmara-ai'
    >
      Miguel Emmara
    </a>
    <span>and</span>
    <a
      className='hover:text-blue-500 transition-all'
      target='_blank'
      href='https://github.com/Glennpgp'
    >
      Glenn Neil
    </a>
  </div>
</section>
```

## Conclusion

The landing page of the Adroit Manager Frontend application provides an attractive and informative introduction to the application. It showcases the key features, displays a sample dashboard image, and acknowledges the project's conception and contributors.
