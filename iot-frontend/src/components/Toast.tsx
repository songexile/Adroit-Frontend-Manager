import { toast, ToastOptions } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface ToastProps {
  message: string
  type?: 'success' | 'error' | 'warning' | 'info'
  options?: ToastOptions
}

export const showToast = ({ message, type = 'info', options = {} }: ToastProps) => {
  const defaultOptions: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'dark',
  }

  const mergedOptions = { ...defaultOptions, ...options }

  switch (type) {
    case 'success':
      toast.success(message, mergedOptions)
      break
    case 'error':
      toast.error(message, mergedOptions)
      break
    case 'warning':
      toast.warn(message, mergedOptions)
      break
    default:
      toast(message, mergedOptions)
      break
  }
}
