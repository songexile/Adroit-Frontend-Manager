import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDataFetch } from '@/hooks/useDataFetch'
import { AuthCheckAndAction } from '@/components/AuthCheckAndAction'
import NextTopLoader from 'nextjs-toploader'

function MyApp({ Component, pageProps }: AppProps) {
  const { data, loading, hasFetchedData, fetchDataAndUpdate } = useDataFetch()

  return (
    <>
      <SessionProvider session={pageProps.session}>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <AuthCheckAndAction
          data={data}
          loading={loading}
          hasFetchedData={hasFetchedData}
          fetchDataAndUpdate={fetchDataAndUpdate}
        >
          <NextTopLoader
            color="#8A6616"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={true}
            easing="ease"
            speed={200}
            shadow="0 0 10px #8A6616,0 0 5px #8A6616"
            template='<div class="bar" role="bar"><div class="peg"></div></div>
  <div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
            zIndex={1600}
            showAtBottom={false}
          />
          <Component data={data} {...pageProps} fetchDataAndUpdate={fetchDataAndUpdate} />
        </AuthCheckAndAction>
      </SessionProvider>
    </>
  )
}

export default MyApp
