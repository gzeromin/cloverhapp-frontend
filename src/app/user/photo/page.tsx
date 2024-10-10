'use client';
import { memo, useRef } from 'react';
import api from '@/utils/api.util';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import { Dialog, Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import UserProrile from '@/components/molecules/UserProrile';
import { handleError } from '@/utils/error.util';

const Photo: React.FC = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const inputOpenImageRef = useRef<HTMLInputElement>(null);

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

  const deletePhoto = async (): Promise<void> => {
    if (user && !user.photoUrl) {
      const dialogRes = await Dialog.openDialog(
        Dialog.WARNING, Language.$t.Warning.DeletePhoto);
      if (dialogRes) {
        return;
      }
    }

    Loading.setIsLoading(true);
    try {
      await api.patch('/auth/delete-profile-photo');
      dispatch(AuthActionEnum.SET_PROFILE_PHOTO, null);
    } catch (error) {
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="">
      <div className="flex w-[250px] h-[250px] flex-col border-dashed border-primary border-4 p-1 mb-1 items-center justify-center rounded-full">
        {user && (
          <UserProrile
            user={user}
            alt={'User Profile'}
            size={220}
            className="rounded-full object-cover aspect-square"
          />
        )}
      </div>
      <button
        className="w-full py-3 mt-5 mb-2 text-s tracking-wider font-bold uppercase
  bg-gray-200 border hover:bg-green-700 hover:text-white rounded"
        onClick={handleOpenImageRef}
      >
        {Language.$t.Button.ChangePhoto}
      </button>
      <button
        className="w-full py-3 mt-2 mb-2 text-s tracking-wider font-bold uppercase
  bg-gray-200 border hover:bg-red-700 hover:text-white rounded"
        onClick={deletePhoto}
      >
        {Language.$t.Button.DeletePhoto}
      </button>
      {/* Controller - Photo*/}
      <input
        onChange={handleUploadImage}
        accept="image/jpeg, image/png"
        style={{ display: 'none' }}
        ref={inputOpenImageRef}
        type="file"
      />
    </div>
  );
};

export default memo(observer(Photo));
