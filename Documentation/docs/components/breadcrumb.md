# Breadcrumb

## Navigation Component

The `Breadcrumb` component is a reusable component that renders a breadcrumb navigation. It displays a series of links representing the current page's hierarchy.

## File Path

The `Breadcrumb` component is located at the following path:
<br>
`iot-frontend/src/components/Breadcrumb.tsx`

## Props

The `Breadcrumb` component accepts the following props:

| Prop          | Type               | Description                                                             |
| ------------- | ------------------ | ----------------------------------------------------------------------- |
| `breadcrumbs` | `BreadcrumbItem[]` | An array of `BreadcrumbItem` objects representing the breadcrumb items. |

The `BreadcrumbItem` interface has the following properties:

| Property | Type     | Description                              |
| -------- | -------- | ---------------------------------------- |
| `name`   | `string` | The display name of the breadcrumb item. |
| `path`   | `string` | The URL path of the breadcrumb item.     |

## Usage

To use the `Breadcrumb` component, import it into your React component and pass the required `breadcrumbs` prop:

```tsx
import Breadcrumb from './Breadcrumb';

const MyComponent = () => {
  const breadcrumbs = [
    { name: 'Home', path: '/' },
    { name: 'Category', path: '/category' },
    { name: 'Subcategory', path: '/category/subcategory' },
  ];

  return (
    <div>
      <Breadcrumb breadcrumbs={breadcrumbs} />
      {/* Other components */}
    </div>
  );
};
```
