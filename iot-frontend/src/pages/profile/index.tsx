import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LoginScreen from '../login';
import { useEffect, useState } from 'react';
import { CustomSession, CustomUser } from '@/types';
import { showToast } from '@/components/Toast';
import {
  CognitoIdentityProviderClient,
  UpdateUserAttributesCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { useAuth } from '@/hooks/useAuth';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const Profile = () => {
  const { isAuthenticated, session, isLoading } = useAuth();

  const [givenName, setGivenName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  // Extract user data if session exists
  useEffect(() => {
    if (session) {
      const { given_name, family_name, email } = session.user as CustomUser;
      setGivenName(given_name || '');
      setFamilyName(family_name || '');
      setEmail(email || '');
    }
  }, [session]);

  const handleUpdateAttribute = async (attributeName: string, attributeValue: string) => {
    if (isAuthenticated && session) {
      try {
        console.log('handleUpdateAttribute - session:', session);

        const client = new CognitoIdentityProviderClient({
          region: process.env.NEXT_PUBLIC_AWS_REGION,
          credentials: {
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID!,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY!,
          },
        });

        const accessToken = (session as CustomSession).accessToken;

        const command = new UpdateUserAttributesCommand({
          UserAttributes: [
            {
              Name: attributeName,
              Value: attributeValue,
            },
          ],
          AccessToken: accessToken,
        });

        await client.send(command);

        // Update existing value on frontend
        switch (attributeName) {
          case 'given_name':
            setGivenName(attributeValue);
            break;
          case 'family_name':
            setFamilyName(attributeValue);
            break;
          case 'email':
            setEmail(attributeValue);
            break;
          default:
            break;
        }
      } catch (error: any) {
        console.log('handleUpdateAttribute - error:', error);
        showToast({ message: 'Error updating user attribute: ' + error.message, type: 'error' });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await handleUpdateAttribute('given_name', givenName);
      await handleUpdateAttribute('family_name', familyName);
      await handleUpdateAttribute('email', email);
      showToast({ message: 'Attributes were successfully updated.', type: 'success' });
    } catch (error: any) {
      showToast({ message: 'Error updating user attributes: ' + error.message, type: 'error' });
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen mt-64 gap-2 flex flex-col items-center justify-center">
        <div className="h-5/6 w-full"></div>
        <LoadingSpinner className={'h-32 w-32'} />
        <h1>Loading...</h1>
      </div>
    );
  }

  if (isAuthenticated) {
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
                <label
                  htmlFor="email"
                  className="mb-3 block text-base font-medium text-[#07074D]"
                >
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
    );
  } else {
    return <LoginScreen />;
  }
};

export default Profile;
