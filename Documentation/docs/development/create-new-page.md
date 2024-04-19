# Create New Page

To create a new page, follow these steps:

1. Create a new folder in src/pages/, for example, new-page.

2. Inside the new folder, create a TypeScript file named index.tsx.

3. Add the following code to index.tsx:

```ts
import React from 'react';

const newPage = () => {
  return <div>My New Page</div>;
};

export default newPage;
```

It should create a new route and you can visit on http://localhost:3000/new-page/
