import Toast from 'react-native-toast-message';

export const useToast = () => {
  const showSuccess = (message) => {
    Toast.show({
      type: 'success',
      text1: message,
      position: 'top',
    });
  };

  const showError = (title, message) => {
    Toast.show({
      type: 'error',
      text1: title,
      text2: message,
      position: 'top',
    });
  };

  return {
    showSuccess,
    showError,
  };
}; 