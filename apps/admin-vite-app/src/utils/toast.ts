import { toast as sonnerToast } from "sonner";

export const toast = {
  success: (message: string) => {
    sonnerToast.success(message);
  },
  
  error: (error: any, defaultMessage: string = "Something went wrong") => {
    // Automatically extract error message from API response if available
    const message = error?.response?.data?.message || error?.message || defaultMessage;
    sonnerToast.error(message);
  },
  
  info: (message: string) => {
    sonnerToast.info(message);
  },
  
  warning: (message: string) => {
    sonnerToast.warning(message);
  }
};
