import { memo, useRef } from 'react';
import UserProrile from './UserProrile';
import { Dialog, Language, Loading } from '@/mobx';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import api, { BUCKET_URL } from '@/utils/api.util';
import { AiOutlineEdit } from 'react-icons/ai';
import Image from 'next/image';
import { thousandComma } from '@/utils/number.util';
import cls from 'classnames';
interface Props {}

const Profile: React.FC<Props> = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const inputOpenImageRef = useRef<HTMLInputElement>(null);
  const buttonStyle = 'w-full ' +
    'text-s tracking-wider font-bold uppercase ' +
    'bg-gray-200 border ' +
    'hover:bg-primary-hover hover:text-primary rounded';
  const onClickChangeName = async () => {
    await Dialog.openInput(
      Language.$t.Placeholder.Nickname,
      Language.$t.Input.Nickname,
      Language.$t.Placeholder.Nickname,
      onSubmit,
      user?.nickname,
    );
  };

  const onSubmit = async (input: string): Promise<void> => {
    const res = await api.post('/auth/change-nickname', {
      nickname: input,
    });
    const updatedNickname = res.data?.nickname;
    dispatch(AuthActionEnum.SET_NICKNAME, updatedNickname);
    Dialog.closeDialog(true);
  };

  const handleOpenImageRef = () => {
    if (inputOpenImageRef.current) {
      inputOpenImageRef.current.click();
    }
  };

  const handleUploadImage = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      Loading.setIsLoading(true);
      try {
        const formData = new FormData();
        formData.append('profile-photo', file);

        // 서버로 formData 전송
        const response = await api.post(
          '/auth/upload-profile-photo',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        );

        dispatch(AuthActionEnum.SET_PROFILE_PHOTO, response.data.filePath);
      } catch (error) {
        console.error('Error uploading file:', error);
      } finally {
        Loading.setIsLoading(false);
      }
    }
  };

  const onClickWithdrawal = async () => {
    await Dialog.openInput(
      Language.$t.Placeholder.Password,
      Language.$t.Input.Password,
      Language.$t.Placeholder.Password,
      onSubmitWithdrawal,
      '',
      'password',
    );
  };

  const onSubmitWithdrawal = async (input: string) => {
    await api.post('/auth/withdrawal', { password: input });
    dispatch(AuthActionEnum.LOGOUT);
    Dialog.closeDialog(true);
  };

  return (
    <div className=''>
      {/* profile Area */}
      <div className="pt-3 flex flex-col grow">
        <div className={cls('p-4 flex gap-4 items-center justify-around')}>
          {/* Photo */}
          <div className={cls('w-1/2')}>
            <div className={cls(
              'p-1 flex flex-col items-center justify-center', 
              'border-dashed border-primary border-4', 
              'rounded-full'
            )}>
              {user && (
                <UserProrile
                  user={user}
                  alt={'User Profile'}
                  size={120}
                  className="rounded-full object-cover aspect-square"
                />
              )}
            </div>
            {/* Controller - Photo*/}
            <input
              onChange={handleUploadImage}
              accept="image/jpeg, image/png"
              style={{ display: 'none' }}
              ref={inputOpenImageRef}
              type="file"
            />
          </div>
          {/* Info & */}
          <div className="flex items-center justify-center text-2xl font-bold">
            {user && user.nickname}
            <AiOutlineEdit
              className="ml-1 hover:bg-gray-200 hover:text-primary cursor-pointer rounded-md"
              style={{
                transition:
              'background-color 0.15s ease-in-out, color 0.2s ease-in-out',
              }}
              onClick={() => onClickChangeName()}
            />
          </div>
        </div>
        {/* change photo */}
        <button
          className={cls(buttonStyle, 'py-3')}
          onClick={handleOpenImageRef}
        >
          {Language.$t.Button.ChangePhoto}
        </button>
      </div>
      {/* Button Area */}
      <div className={cls('flex flex-col gap-0')}>
        {/* charge droplet */}
        <div className={cls('w-full flex flex-col items-end -translate-y-6')}>
          <div className="flex items-center translate-y-6">
            <Image
              src={`${BUCKET_URL}/water.png`}
              alt="droplet"
              className=""
              width={55}
              height={55}
              priority
            />
            <div className="font-bold text-lg">{user && thousandComma(user.droplet)}</div>
          </div>
          <button
            className={cls(buttonStyle, 'py-3')}
          >
            {Language.$t.Button.ChargeDroplet}
          </button>
        </div>
        {/* change password */}
        <button
          className={cls(buttonStyle, 'py-3')}
        >
          {Language.$t.Button.ChangePassword}
        </button>
        {/* Google AdSence */}
        {/* withdrawal */}
        <button
          className={cls(buttonStyle, 
            'absolute bottom-0',
            'py-1 border-8 border-gray-200', 
            'hover:text-danger hover:border-danger')}
          onClick={onClickWithdrawal}
        >
          {Language.$t.UserMenu.Withdrawal}
        </button>
      </div>
    </div>
  );
};

export default memo(Profile);
