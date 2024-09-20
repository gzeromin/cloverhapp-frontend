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
import { UserStamp } from '@/types/UserStamp';
import { handleError } from '@/utils/error.util';
import { TfiPencilAlt } from 'react-icons/tfi';
import { FaExclamation } from 'react-icons/fa';
import { AiFillCloseSquare } from 'react-icons/ai';

interface HappSaveModalProps {
  userStamp: UserStamp | undefined;
  closeModal: () => void;
  mutateHapp?: () => void;
}

const HappSaveModal: React.FC<HappSaveModalProps> = ({
  userStamp,
  closeModal,
  mutateHapp,
}) => {
  const [openMemoSpace, setOpenMemoSpace] = useState(false);
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
  const createHapp = async () => {
    Loading.setIsLoading(true);
    try {
      if (user) {
        const createHappDto = {
          userId: user.id,
          UserStamp: userStamp,
          memo,
        };
        const formData = new FormData();
        if (uploadedImages != null) {
          uploadedImages.forEach((file) => {
            formData.append('happ-images', file);
          });
        }
        formData.append('happ-data', JSON.stringify(createHappDto));
        const res = await api.post('/happ', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (mutateHapp) {
          // DayLog
          mutateHapp();
        } else {
          // HappCalendar
          dispatch(AuthActionEnum.SET_HAPP, res.data);
        }
      }
      closeModal();
    } catch (error: any) {
      console.log(error);
      handleError(error);
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
        <div className="relative flex flex-col gap-2 items-stretch p-3 pb-0 lg:flex-row">
          <AiFillCloseSquare
            className={cls(
              'text-primary cursor-pointer text-3xl', 
              'mr-2 hover:text-primary-hover',
              'absolute right-0'
            )}
            onClick={closeModal}
          />
          {userStamp &&
            <Image
              src={userStamp.Stamp.url}
              alt={`happ modify modal ${userStamp.alias}`}
              className="h-auto object-contain aspect-square lg:w-1/2"
              width={90}
              height={90}
              priority
            />
          }
          <div
            className={cls('w-full flex flex-col justify-around items-center')}
          >
            <p className={cls(
              Language.logoFont,
              'text-4xl'
            )}>
              {userStamp?.alias}
            </p>
            <button
              className={cls(
                'w-full rounded-lg border-primary',
                'border-2 border-dashed', 
                'hover:bg-primary hover:text-white py-1.5 px-3',
                'text-primary font-normal text-lg',
                'flex items-center justify-center'
              )}
              onClick={createHapp}
            >
              {Language.$t.Button.Stamping} <FaExclamation />
            </button>
          </div>
        </div>
        {/* body */}
        <div className="pt-0 p-2">
          {/* Mini Navigation */}
          <div className="flex gap-3 justify-end items-center bg-primary-hover rounded p-2 mb-2">
            <TfiPencilAlt 
              className={cls(
                'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
                {
                  'text-primary': openMemoSpace,
                },
              )}
              onClick={() => setOpenMemoSpace(!openMemoSpace)}
            />
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
            <TextareaHapp
              className={`${openMemoSpace ? 'block' : 'hidden'} text-lg`}
              placeholder={Language.$t.Placeholder.Memo}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              autoHeight={true}
              border={true}
              marginBottom=""
              textAreaClassName='border-dashed border-2 border-gray-100 min-h-[50px]'
            />
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
      </div>
    </div>
  );
};

export default observer(HappSaveModal);
