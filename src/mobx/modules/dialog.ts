import { makeAutoObservable } from 'mobx';
import { Language } from '..';

export interface DialogInput {
  input: string;
}

class dialog {
  //types
  SUCCESS = 'success';
  DANGER = 'danger';
  WARNING = 'warning';
  INFO = 'info';
  CONFIRM = 'confirm';
  INPUT = 'input';

  // inpuy field
  labelName = '';
  placeholder = '';
  defaultInput: string | undefined = '';
  inputError: { input?: string } = {};
  inputType: string | undefined = 'text';
  onSubmit: ((input: string) => Promise<void>) | undefined = undefined;

  show = false;
  type = this.INFO;
  message = '';
  subMessage: string | undefined = '';
  result: boolean | ((value: unknown) => void) = false;

  constructor() {
    // Make the class auto observable
    makeAutoObservable(this);
  }

  openDialog = (type: string, message: string, subMessage?: string) => {
    this.show = true;
    this.type = type;
    this.message = message;
    this.subMessage = subMessage;
    return new Promise((resolve) => {
      this.result = resolve;
    });
  };

  openInput = (
    message: string,
    labelName: string,
    placeholder: string,
    onSubmit?: (input: string) => Promise<void>,
    defaultInput?: string,
    inputType?: string,
  ) => {
    this.show = true;
    this.type = this.INPUT;
    this.message = message;
    this.labelName = labelName;
    this.placeholder = placeholder;
    this.onSubmit = onSubmit;
    this.defaultInput = defaultInput;
    this.inputType = inputType;
    this.inputError = {};
    return new Promise((resolve) => {
      this.result = resolve;
    });
  };

  setInputError = (message: string | undefined) => {
    this.inputError = { input: message };
  };

  setShow = (isShow: boolean) => {
    this.show = isShow;
  };

  closeDialog = (result: boolean) => {
    this.show = false;
    if (typeof this.result === 'boolean') {
      this.result = result;
    } else {
      this.result(result);
    }
  };

  saveDialog = (result: boolean) => {
    if (typeof this.result === 'boolean') {
      this.result = result;
    } else {
      this.result(result);
    }
  };

  get title() {
    switch (this.type) {
    case this.SUCCESS:
      return Language.$t.Dialog.Success;
    case this.DANGER:
      return Language.$t.Dialog.Danger;
    case this.WARNING:
      return Language.$t.Dialog.Warning;
    case this.INFO:
      return Language.$t.Dialog.Info;
    case this.CONFIRM:
      return Language.$t.Dialog.Confirm;
    case this.INPUT:
      return Language.$t.Dialog.Input;
    default:
      return null;
    }
  }
}

export default dialog;
