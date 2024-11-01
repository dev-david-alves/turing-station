import { toast } from "react-toastify";

const options = {
  position: "top-right",
  autoClose: 1500,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: false,
  theme: "dark",
};

export const SuccessToast = (message = "") => {
  return () => toast.success(message, options);
};

export const ErrorToast = (message = "") => {
  options.autoClose = 3000;
  return () => toast.error(message, options);
};

export const WarnToast = (message = "") => {
  options.autoClose = 3000;
  return () => toast.warn(message, options);
};
