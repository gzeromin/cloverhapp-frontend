'use client';
import { memo } from 'react';
import api from '@/utils/api.util';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import { Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { Dialog } from '@/mobx';
import cls from 'classnames';
import SelectHapp from '@/components/atoms/SelectHapp';
import { Locale } from '@/types/User';
import FieldWrapperHapp from '@/components/atoms/FieldWrapperHapp';
import { AiOutlineEdit } from 'react-icons/ai';
import { handleError } from '@/utils/error.util';

const languageOptions = [
  { value: Locale.Kr, labelLevel0: '한국어', image: { src: Language.flagKr } },
  { value: Locale.En, labelLevel0: 'English', image: { src: Language.flagEn } },
  { value: Locale.Jp, labelLevel0: '日本語', image: { src: Language.flagJp } },
];

const Info: React.FC = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  const handleLocale = async (locale: Locale) => {
    if (user) {
      Loading.setIsLoading(true);
      try {
        const res = await api.post('/auth/locale', { locale });
        const updatedLocale = res.data?.locale;
        dispatch(AuthActionEnum.SET_LOCALE, { locale: updatedLocale });
      } catch (error: any) {
        handleError(error);
      } finally {
        Loading.setIsLoading(false);
      }
    } else {
      Language.setLanguage(locale);
    }
  };

  const onClickChangeName = async () => {
    await Dialog.openInput(
      Language.$t.Placeholder.Nickname,
      Language.$t.Input.Nickname,
      Language.$t.Placeholder.Nickname,
      onSubmitChangeName,
      user?.nickname,
    );
  };

  const onSubmitChangeName = async (input: string): Promise<void> => {
    const res = await api.post('/auth/nickname', {
      nickname: input,
    });
    const updatedNickname = res.data?.nickname;
    dispatch(AuthActionEnum.SET_NICKNAME, updatedNickname);
    Dialog.closeDialog(true);
  };

  return (
    <div className="w-10/12 mx-auto md:w-96">
      <FieldWrapperHapp
        labelName={Language.$t.Input.Email}
        className={cls('flex items-center')}
        labelClassName={cls('w-1/3')}
        border={false}
      >
        <p>{user?.email}</p>
      </FieldWrapperHapp>
      <FieldWrapperHapp
        labelName={Language.$t.Input.Nickname}
        className={cls('flex items-center')}
        labelClassName={cls('w-1/3')}
        border={false}
      >
        <div className="flex items-center justify-between break-all">
          {user && (
            <p>
              { user.nickname }
            </p>
          )}
          <AiOutlineEdit
            className={cls(
              'ml-1 rounded-md text-2xl',
              'hover:bg-gray-200 hover:text-primary cursor-pointer'
            )}
            style={{
              transition: 'background-color 0.15s ease-in-out, color 0.2s ease-in-out',
            }}
            onClick={() => onClickChangeName()}
          />
        </div>
      </FieldWrapperHapp>
      <SelectHapp
        labelName={Language.$t.Select.Language}
        className={cls('flex items-center mb-3')}
        labelClassName={cls('w-1/3')}
        options={languageOptions}
        selected={Language.type}
        onSelected={handleLocale}
        id="localeSelect"
        border={true}
      />
    </div>
  );
};

export default memo(observer(Info));
