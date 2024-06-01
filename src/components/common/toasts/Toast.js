import { toast } from 'react-toastify';

export const showToast = (text, type) => {
  const toastConfig = {
    position: toast.POSITION.TOP_RIGHT,
    autoClose: 1500,
  };

  switch (type) {
    case 'success':
      toast.success(text, toastConfig);
      break;
    case 'error':
      toast.error(text, toastConfig);
      break;
    case 'info':
      toast.info(text, toastConfig);
      break;
    default:
      break;
  }
};
