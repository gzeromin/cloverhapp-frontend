'use client';
import { FormEvent, memo, useState } from 'react';
import api from '@/utils/api.util';
import { handleError } from '@/utils/error.util';
import { Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { Dialog } from '@/mobx';
import InputHapp from '@/components/molecules/InputHapp';
import { useAuthState } from '@/context/auth';

const Password: React.FC = () => {
  const { user } = useAuthState();
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [errors, setErrors] = useState<{
    oldPassword?: string;
    password?: string;
    passwordConfirm?: string;
  }>({});

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    Loading.setIsLoading(true);
    setErrors({}); // resetError
    try {
      await api.post('/auth/password', {
        locale: user?.locale,
        oldPassword,
        password,
        passwordConfirm,
      });
      const dialogReulst = await Dialog.openDialog(
        Dialog.SUCCESS,
        Language.$t.Success.ChangePassword,
      );
      if (dialogReulst) {
        setOldPassword('');
        setPassword('');
        setPasswordConfirm('');
      }
    } catch (error: any) {
      handleError(error, setErrors);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="w-10/12 mx-auto md:w-96">
      <form onSubmit={onSubmit}>
        <InputHapp
          id="password-password"
          labelName={Language.$t.Input.Password}
          placeholder={Language.$t.Placeholder.Password}
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          error={errors.oldPassword}
        />
        <InputHapp
          id="password-newPassword"
          labelName={Language.$t.Input.NewPassword}
          placeholder={Language.$t.Placeholder.NewPassword}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />
        <InputHapp
          id="password-passwordConfirm"
          labelName={Language.$t.Input.PasswordConfirm}
          placeholder={Language.$t.Placeholder.PasswordConfirm}
          type="password"
          value={passwordConfirm}
          onChange={(e) => setPasswordConfirm(e.target.value)}
          error={errors.passwordConfirm}
        />
        <button
          className="w-full py-3 mt-5 mb-2 text-s tracking-wider font-bold text-white uppercase
   bg-primary border hover:bg-primary-hover hover:text-primary rounded"
        >
          {Language.$t.Button.ChangePassword}
        </button>
      </form>
    </div>
  );
};

export default memo(observer(Password));
