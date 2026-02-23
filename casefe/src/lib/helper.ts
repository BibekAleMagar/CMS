import { toast, ToastOptions } from "react-toastify";

const Alert = (success: boolean, text: string, options?: ToastOptions) => {
  if (success) {
    toast.success(text, options);
  } else {
    toast.error(text, options);
  }
};

export const sweetAlert = {
  success: (text: string, options?: ToastOptions) => Alert(true, text, options),

  error: (text: string, options?: ToastOptions) => Alert(false, text, options),
};
