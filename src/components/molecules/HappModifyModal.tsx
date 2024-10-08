'use client';
import { Happ } from '@/types/Happ';
import api from '@/utils/api.util';
import { useEffect, useState } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import { TbPhoto, TbArrowsMove } from 'react-icons/tb';
import { TfiCheckBox } from 'react-icons/tfi';
import { Language, Loading } from '@/mobx/index';
import TextareaHapp from '../atoms/TextareaHapp';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import FileUploadHapp from '../atoms/FileUploadHapp';
import { AuthActionEnum, useAuthDispatch } from '@/context/auth';
import { GoPeople, GoTag } from 'react-icons/go';
import AddFriendsHapp from '../atoms/AddFriendsHapp';
import AddTagsHapp from '../atoms/AddTagsHapp';
import { LuCopyPlus } from 'react-icons/lu';
import { Friend } from '@/types/Friend';
import { Tag } from '@/types/Tag';
import Image from 'next/image';

interface HappModifyModalProps {
  happId: string;
  closeModal: () => void;
}

const HappModifyModal: React.FC<HappModifyModalProps> = ({
  happId,
  closeModal,
}) => {
  const [openUploadPhoto, setOpenUploadPhoto] = useState(false);
  const [openTimeMover, setOpenTimeMover] = useState(false);
  const [openAddFriends, setOpenAddFriends] = useState(false);
  const [openAddTags, setOpenAddTags] = useState(false);
  const [startTime, setStartTime] = useState<Date>();
  const [uploadedImages, setUploadedImages] = useState<File[] | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>();
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [memo, setMemo] = useState('');
  const [stampUrl, setStampUrl] = useState<string | undefined>();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    api.get('/happ/' + happId).then((res) => {
      const happ: Happ = res.data;
      setStartTime(new Date(happ.startTime));
      setMemo(happ.memo);
      setStampUrl(happ.UserStamp.Stamp.url);
      if (happ.imageUrls && happ.imageUrls.length !== 0) {
        setImageUrls(happ.imageUrls);
        setOpenUploadPhoto(true);
      }
      if (happ.Tags && happ.Tags.length !== 0) {
        setTagList(happ.Tags);
        setOpenAddTags(true);
      }
    });
  }, [happId]);

  const updateHapp = async () => {
    Loading.setIsLoading(true);
    try {
      const updateHappDto = {
        id: happId,
        startTime: startTime,
        memo,
        imageUrls: imageUrls,
        friends: friendList,
        tags: tagList,
      };
      const formData = new FormData();
      if (uploadedImages != null) {
        uploadedImages.forEach((file) => {
          formData.append('happ-images', file);
        });
      }
      formData.append('happ-data', JSON.stringify(updateHappDto));

      const res = await api.patch('/happ', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(AuthActionEnum.UPDATE_HAPP, res.data);
      closeModal();
    } catch (error: any) {
      console.log(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="z-50 fixed inset-0 w-full h-full flex flex-col items-center justify-center">
      <div className="fixed inset-0 w-full h-full bg-black opacity-50">
        {/* Background opacity */}
      </div>
      <div className="z-50 box-border shadow-lg min-w-[500px] max-w-[600px] bg-white border border-light-black rounded-lg text-2xl">
        {/* header */}
        <div className="flex justify-between items-center border-b border-light-gray p-3">
          {stampUrl && (
            <Image
              src={stampUrl}
              alt={`happ modify modal ${happId}`}
              className="object-contain aspect-square"
              width={50}
              height={50}
            />
          )}
          <AiFillCloseSquare
            className="text-primary cursor-pointer text-3xl mr-2 hover:text-primary-hover"
            onClick={closeModal}
          />
        </div>
        {/* body */}
        <div className="p-4 max-h-4/5 overflow-y-auto">
          <TextareaHapp
            placeholder={Language.$t.Placeholder.Description}
            rows={2}
            value={memo}
            onChange={(e) => setMemo(e.target.value)}
            border={false}
            autoHeight={true}
          />
          <div className="gap-4">
            {/* Drop Zone */}
            <FileUploadHapp
              className={`${openUploadPhoto ? 'block' : 'hidden'} m-1`}
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
              friends={friendList}
              setFriends={setFriendList}
            />
            <AddTagsHapp
              className={`${openAddTags ? 'block' : 'hidden'}`}
              tags={tagList}
              setTags={setTagList}
            />
            <div className="flex items-center bg-primary-hover rounded p-2 justify-between">
              <div className="flex gap-3">
                <TbPhoto
                  className={cls(
                    'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
                    {
                      'text-primary': openUploadPhoto,
                    },
                  )}
                  onClick={() => setOpenUploadPhoto(!openUploadPhoto)}
                />
                <TbArrowsMove
                  className={cls(
                    'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
                    {
                      'text-primary': openTimeMover,
                    },
                  )}
                  onClick={() => setOpenTimeMover(!openTimeMover)}
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
                <TfiCheckBox />
                <LuCopyPlus />
              </div>
            </div>
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
            onClick={updateHapp}
          >
            {Language.$t.Button.Save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(HappModifyModal);
