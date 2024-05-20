# React Toastify

## Toast Notifications with React Toastify

Adroit Manager Frontend ueses React Toastify, a popular library for displaying toast notifications in React applications. The showToast function in the project is responsible for showing toast notifications with various options and types.

## Usage

The showToast function is a custom utility function that wraps the React Toastify library to provide a convenient way to show toast notifications with different types and options. Here's how you can use it:

```ts
import { showToast } from '@/components/Toast';

// Show a success toast
showToast({
  message: 'Operation completed successfully!',
  type: 'success',
});

// Show an error toast
showToast({
  message: 'An error occurred!',
  type: 'error',
});

// Show a warning toast
showToast({
  message: 'Warning: Something needs attention!',
  type: 'warning',
});

// Show an info toast (default type)
showToast({
  message: 'Some informational message',
});
```

The `showToast` function accepts an object with the following properties:

- `message` (required): The message to display in the toast notification.
- `type` (optional): The type of the toast notification. Possible values are `success`, `error`, `warning`, and `info`. Default is `info`.
- `options` (optional): Additional options to customize the appearance and behavior of the toast notification. You can pass any valid ToastOptions from React Toastify.

## Customization

The showToast function provides some default options for the toast notifications, such as position, auto-close duration, theme, etc. You can override these default options by passing the desired options in the options property when calling showToast.
For example:

```ts
import { showToast } from '@/components/Toast';

showToast({
  message: 'Custom toast notification',
  type: 'info',
  options: {
    position: 'bottom-right',
    autoClose: 3000,
    theme: 'light',
  },
});
``;
```
