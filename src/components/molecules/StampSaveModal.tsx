'use client';
import api from '@/utils/api.util';
import Image from 'next/image';
import { useState } from 'react';
import { TbPhoto } from 'react-icons/tb';
import { Language, Loading } from '@/mobx/index';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import TextareaHapp from '../atoms/TextareaHapp';
import FileUploadHapp from '../atoms/FileUploadHapp';
import { Friend } from '@/types/Friend';
import { Tag } from '@/types/Tag';
import AddFriendsHapp from '../atoms/AddFriendsHapp';
import AddTagsHapp from '../atoms/AddTagsHapp';
import { GoPeople, GoTag } from 'react-icons/go';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';

interface StampSaveModalProps {
  stampName: string | undefined;
  closeModal: () => void;
  mutateStamp?: () => void;
}

const StampSaveModal: React.FC<StampSaveModalProps> = ({
  stampName,
  closeModal,
  mutateStamp,
}) => {
  const [openUploadPhoto, setOpenUploadPhoto] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[] | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>();
  const [memo, setMemo] = useState('');
  const [openAddFriends, setOpenAddFriends] = useState(false);
  const [openAddTags, setOpenAddTags] = useState(false);
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const createStamp = async () => {
    Loading.setIsLoading(true);
    try {
      if (user) {
        const createStampDto = {
          userId: user.id,
          stampName,
          memo,
        };
        const formData = new FormData();
        if (uploadedImages != null) {
          uploadedImages.forEach((file) => {
            formData.append('stamp-images', file);
          });
        }
        formData.append('stamp-data', JSON.stringify(createStampDto));
        const res = await api.post('/stamp', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (mutateStamp) {
          // DayLog
          mutateStamp();
        } else {
          // HappCalendar
          dispatch(AuthActionEnum.SET_STAMP, res.data);
        }
      }
      closeModal();
    } catch (error: any) {
      console.log(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="z-50 fixed inset-0 w-full h-full flex flex-col items-center justify-center">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-50"
      >
        {/* Background opacity */}
      </div>
      <div className="z-50 box-border shadow-lg lg:min-w-[400px] bg-white border border-light-black rounded-lg text-2xl">
        {/* header */}
        <div className="flex flex-col gap-2 items-center p-3 pb-0 lg:flex-row">
          <Image
            src={`https://elasticbeanstalk-us-east-1-149536466661.s3.amazonaws.com/cloverhapp/${stampName}.png`}
            alt={`stamp modify modal ${stampName}`}
            className="h-auto object-contain aspect-square lg:w-1/2"
            width={90}
            height={90}
          />
          <TextareaHapp
            className='text-lg'
            placeholder={Language.$t.Placeholder.Memo}
            rows={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            autoHeight={true}
            border={true}
            marginBottom=""
          />
        </div>
        {/* body */}
        <div className="pt-0 p-2">
          {/* Mini Navigation */}
          <div className="flex gap-3 justify-end items-center bg-primary-hover rounded p-2 mb-2">
            <TbPhoto
              className={cls(
                'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
                {
                  'text-primary':
                        openUploadPhoto || (imageUrls && imageUrls.length > 0),
                },
              )}
              onClick={() => setOpenUploadPhoto(!openUploadPhoto)}
            />
            <GoPeople
              className={cls(
                'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
                {
                  'text-primary': openAddFriends,
                },
              )}
              onClick={() => setOpenAddFriends(!openAddFriends)}
            />
            <GoTag
              className={cls(
                'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
                {
                  'text-primary': openAddTags,
                },
              )}
              onClick={() => setOpenAddTags(!openAddTags)}
            />
          </div>
          <div className="flex flex-col gap-3">
            {/* Drop Zone */}
            <FileUploadHapp
              className={`${openUploadPhoto ? 'block' : 'hidden'}`}
              uploadedImages={uploadedImages}
              setUploadedImages={setUploadedImages}
              width={0}
              height={0}
              textColor="text-gray-400"
              textSize="text-base"
              imageUrls={imageUrls}
              onDeleteImageUrls={() => setImageUrls([])}
            />
            <AddFriendsHapp
              className={`${openAddFriends ? 'block' : 'hidden'}`}
              friendList={friendList}
              setFriendList={setFriendList}
            />
            <AddTagsHapp
              className={`${openAddTags ? 'block' : 'hidden'}`}
              tagList={tagList}
              setTagList={setTagList}
            />
            
          </div>
        </div>
        {/* footer */}
        <div className="grid grid-flow-col justify-center p-1 border-t border-light-gray">
          <button
            className="m-1 border rounded-lg bg-cancel hover:bg-gray-100 py-1.5 px-3 text-white font-extralight text-lg"
            onClick={closeModal}
          >
            {Language.$t.Button.Cancel}
          </button>
          <button
            className="m-1 border rounded-lg bg-primary hover:bg-primary-hover py-1.5 px-3 text-white font-extralight text-lg"
            onClick={createStamp}
          >
            {Language.$t.Button.Save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(StampSaveModal);
