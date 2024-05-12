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
import LoadingIndicator from '@/components/ui/LoadingIndicator';

const Profile = () => {
  const { isAuthenticated, session, isLoading } = useAuth();

  const [givenName, setGivenName] = useState<string>('');
  const [familyName, setFamilyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const [isSubmitLoading, setIsSubmitLoading] = useState(false);

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
    setIsSubmitLoading(true);

    try {
      await handleUpdateAttribute('given_name', givenName);
      await handleUpdateAttribute('family_name', familyName);
      await handleUpdateAttribute('email', email);
      showToast({ message: 'Attributes were successfully updated.', type: 'success' });
      setIsSubmitLoading(false);
    } catch (error: any) {
      showToast({ message: 'Error updating user attributes: ' + error.message, type: 'error' });
    } finally {
      setIsSubmitLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <LoadingIndicator />
      </>
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
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-blue-500 text-primary-foreground hover:bg-blue-600 h-10 px-4 py-2 w-full"
                  disabled={isSubmitLoading}
                >
                  {isSubmitLoading ? (
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : null}
                  {isSubmitLoading ? 'Updating...' : 'Update Profile'}
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
