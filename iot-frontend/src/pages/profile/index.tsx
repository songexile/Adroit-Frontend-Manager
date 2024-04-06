import Header from '@/components/Header'
import Footer from '@/components/Footer'
import LoginScreen from '../login'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { CustomUser } from '@/types'
import { showToast } from '@/components/Toast'

const Profile = () => {
  const { data: session } = useSession()
  const [givenName, setGivenName] = useState<string>('')
  const [familyName, setFamilyName] = useState<string>('')
  const [email, setEmail] = useState<string>('')

  // Extract user data if session exists
  useEffect(() => {
    if (session) {
      // console.log(session);
      const { given_name, family_name, email } = session.user as CustomUser
      setGivenName(given_name)
      setFamilyName(family_name)
      setEmail(email)
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      showToast({ message: 'User profile updated successfully!', type: 'success' })
    } catch (error) {
      showToast({ message: 'Error updating user profile: ' + error, type: 'error' })

    }
  }

  if (session) {
    return (
      <>
        <Header />
        <div className="flex items-center justify-center p-12">
          <div className="mx-auto w-full max-w-[550px] bg-white min-h-screen">
            <form onSubmit={handleSubmit}>
              <div className="mb-5">
                <label
                  htmlFor="givenName"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Given Name
                </label>
                <input
                  type="text"
                  name="givenName"
                  id="givenName"
                  value={givenName}
                  onChange={(e) => setGivenName(e.target.value)}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label
                  htmlFor="familyName"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
                  Family Name
                </label>
                <input
                  type="text"
                  name="familyName"
                  id="familyName"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div className="mb-5">
                <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="hover:shadow-form w-full rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none"
                >
                  Update Profile
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </>
    )
  } else {
    return <LoginScreen />
  }
}

export default Profile
