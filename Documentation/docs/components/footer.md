# Footer

## Component

The `Footer` component is a reusable component that renders a footer section at the bottom of a page. It displays the copyright information and the current version of the application.

## File Path

The `Footer` component is located at the following path:
<br>
`iot-frontend/src/components/Footer.tsx`

## Usage

To use the `Footer` component, import it into your React component and include it at the desired location, typically at the bottom of your page layout:

```tsx
import React from 'react';
import Footer from './Footer';

const MyComponent = () => {
  return (
    <div>
      {/* Other components */}
      <Footer />
    </div>
  );
};

export default MyComponent;
```

The Footer component does not require any props and can be used as is.

## Functionality

The `Footer` component displays the following information:

- Copyright notice: It shows the copyright symbol `(©)` followed by the company name "Adroit" and the established year (2015) to the current year. The current year is dynamically calculated using `new Date().getFullYear()`.

- Version number: It displays the current version of the application, which is hardcoded as `"v1.0.0"` inside the component.
