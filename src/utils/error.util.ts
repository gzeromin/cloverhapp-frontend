import { Dialog, Language } from '@/mobx';
import { Dispatch, SetStateAction } from 'react';

enum StatusCode {
  FormError = 1000,
  SystemError = 500,
}

export const handleError = async (
  error: any,
  setErrors: Dispatch<SetStateAction<any>>,
  inputFlag: boolean = false,
) => {
  const statusCode = error.response?.data?.statusCode;
  const message = error.response?.data?.message;
  switch (statusCode) {
  // FormError
  // message: { field: string; message: string }[]
  case StatusCode.FormError:
    message.forEach(
      ({ field, message }: { field: string; message: string }) => {
        if (inputFlag) {
          setErrors(message);
        } else {
          setErrors((prev: any) => ({ ...prev, [field]: message }));
        }
      },
    );
    return true;
    // Default
    // message: string | string[] | null | ''
  case StatusCode.SystemError:
    return await Dialog.openDialog(
      Dialog.DANGER,
      Language.$t.ErrorMessage.SystemError,
    );
  default:
    let dialogMessage = '';
    if (Array.isArray(message)) {
      message.forEach((m) => {
        if (typeof m === 'string') {
          dialogMessage = dialogMessage + '\n' + m;
        }
      });
    } else if (typeof message === 'string') {
      dialogMessage = message;
    } else {
      dialogMessage = error.message;
    }
    return await Dialog.openDialog(
      Dialog.DANGER,
      dialogMessage,
    );
  }

  return true;
};
