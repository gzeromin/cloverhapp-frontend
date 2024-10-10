'use client';
import { Dialog, Language } from '@/mobx';
import { memo } from 'react';
import { observer } from 'mobx-react-lite';
import api from '@/utils/api.util';
import { AuthActionEnum, useAuthDispatch } from '@/context/auth';

interface Props {}

const Withdrawal: React.FC<Props> = () => {
  const dispatch = useAuthDispatch();

  const onClickWithdrawal = async () => {
    await Dialog.openInput(
      Language.$t.Placeholder.Password,
      Language.$t.Input.Password,
      Language.$t.Placeholder.Password,
      onSubmit,
      '',
      'password',
    );
  };

  const onSubmit = async (input: string) => {
    await api.post('/auth/withdrawal', { password: input });
    dispatch(AuthActionEnum.LOGOUT);
    Dialog.closeDialog(true);
  };

  return (
    <button
      className="w-[300px] py-3 mt-5 mb-2 text-s tracking-wider font-bold uppercase
   bg-gray-200 border hover:bg-primary-hover hover:text-primary rounded"
      onClick={onClickWithdrawal}
    >
      {Language.$t.UserMenu.Withdrawal}
    </button>
  );
};

export default memo(observer(Withdrawal));
