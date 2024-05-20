# Create New Page

To create a new page in Adroit Manager Frontend, follow these steps:

1. Create a new folder in `src/pages/`, for example, `new-page`.
2. Inside the new folder, create a TypeScript file named `index.tsx`.
3. Add the following code to `index.tsx`:

```tsx
// src/pages/new-page/index.tsx
import React from 'react';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import LoadingIndicator from '@/components/ui/LoadingIndicator';
import LoginScreen from '../login';
import { useAuth } from '@/hooks/useAuth';
import SEO from '@/components/SEO';

const NewPage = () => {
  const { isLoading, isAuthenticated } = useAuth();

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
        <SEO title={title} description={description} />
        <Header />
        <div>My New Page</div>
        <Footer />
      </>
    );
  }

  return <LoginScreen />;
};

export default NewPage;
```

This will create a new route, and you can visit it at `http://localhost:3000/new-page/`.

## Explanation

- The `useAuth` hook is used to check the authentication status of the user.
- If the user is not authenticated, the `LoginScreen` component is rendered, prompting the user to log in.
- If the user is authenticated, the page content is rendered, including the `Header`, `Footer`, and the main content of the page.
- The `LoadingIndicator` component is displayed while the authentication status is being checked.
- The `SEO` component is used to set the page `title` and `description` for search engine optimization.

Make sure to replace `title` and `description` with appropriate values for your new page.