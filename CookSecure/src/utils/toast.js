import toast from 'react-hot-toast'

export const showSuccessToast = (message) => {
  toast.success(message)
}

export const showErrorToast = (message) => {
  toast.error(message)
}

export const showLoadingToast = (message) => {
  return toast.loading(message)
}

export const updateToast = (id, type, message) => {
  toast.dismiss(id)
  if (type === 'success') {
    toast.success(message)
  } else if (type === 'error') {
    toast.error(message)
  }
}