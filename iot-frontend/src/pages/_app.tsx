import '@/styles/globals.css'
import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useDataFetch } from '@/hooks/useDataFetch'
import { AuthCheckAndAction } from '@/components/AuthCheckAndAction'

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
          <Component data={data} {...pageProps} fetchDataAndUpdate={fetchDataAndUpdate} />
        </AuthCheckAndAction>
      </SessionProvider>
    </>
  )
}

export default MyApp
