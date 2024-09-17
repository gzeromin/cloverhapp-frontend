import { action, makeAutoObservable } from 'mobx';

class loading {
  isLoading = false;

  constructor() {
    makeAutoObservable(this, {
      setIsLoading: action,
    });
  }

  setIsLoading = (state: boolean) => {
    this.isLoading = state;
  };
}

export default loading;
