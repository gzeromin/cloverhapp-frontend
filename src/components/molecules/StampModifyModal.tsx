'use client';
import { Stamp, StampStatus } from '@/types/Stamp';
import api from '@/utils/api.util';
import { useEffect, useState } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import { TbPhoto, TbArrowsMove } from 'react-icons/tb';
import { TfiCheckBox } from 'react-icons/tfi';
import { Language, Loading } from '@/mobx/index';
import TextareaHapp from '../atoms/TextareaHapp';
import SelectHapp from '../atoms/SelectHapp';
import { RxLockClosed, RxLockOpen1, RxLockOpen2 } from 'react-icons/rx';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import FileUploadHapp from '../atoms/FileUploadHapp';
import DateTimeHapp from '../atoms/DateTimeHapp';
import { AuthActionEnum, useAuthDispatch } from '@/context/auth';
import { GoPeople, GoTag } from 'react-icons/go';
import AddFriendsHapp from '../atoms/AddFriendsHapp';
import AddTagsHapp from '../atoms/AddTagsHapp';
import { LuCopyPlus } from 'react-icons/lu';
import { Friend } from '@/types/Friend';
import { Tag } from '@/types/Tag';

const options = [
  {
    value: StampStatus.PRIVATE,
    labelLevel1: 'StampStatus',
    labelLevel2: 'Private',
    icon: <RxLockClosed />,
  },
  {
    value: StampStatus.PROTECTED,
    labelLevel1: 'StampStatus',
    labelLevel2: 'Protected',
    icon: <RxLockOpen1 />,
  },
  {
    value: StampStatus.PUBLIC,
    labelLevel1: 'StampStatus',
    labelLevel2: 'Public',
    icon: <RxLockOpen2 />,
  },
];

interface StampModifyModalProps {
  stampId: string;
  closeModal: () => void;
}

const StampModifyModal: React.FC<StampModifyModalProps> = ({
  stampId,
  closeModal,
}) => {
  const [openUploadPhoto, setOpenUploadPhoto] = useState(false);
  const [openTimeMover, setOpenTimeMover] = useState(false);
  const [openAddFriends, setOpenAddFriends] = useState(false);
  const [openAddTags, setOpenAddTags] = useState(false);
  const [stampStatus, setStampStatus] = useState(StampStatus.PRIVATE);
  const [stampedAt, setStampedAt] = useState<Date>();
  const [uploadedImages, setUploadedImages] = useState<File[] | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>();
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const [memo, setMemo] = useState('');

  // const userIcon = stamp.UserIcon;
  const dispatch = useAuthDispatch();

  useEffect(() => {
    api.get('/stamp/' + stampId).then((res) => {
      const stamp: Stamp = res.data;
      setStampedAt(new Date(stamp.stampedAt));
      setMemo(stamp.memo);
      setStampStatus(stamp.status);
      if (stamp.imageUrls && stamp.imageUrls.length !== 0) {
        setImageUrls(stamp.imageUrls);
        setOpenUploadPhoto(true);
      }
      if (stamp.Friends && stamp.Friends.length !== 0) {
        setFriendList(stamp.Friends);
        setOpenAddFriends(true);
      }
      if (stamp.Tags && stamp.Tags.length !== 0) {
        setTagList(stamp.Tags);
        setOpenAddTags(true);
      }
    });
  }, [stampId]);

  const updateStamp = async () => {
    Loading.setIsLoading(true);
    try {
      const updateStampDto = {
        id: stampId,
        stampedAt: stampedAt,
        memo,
        imageUrls: imageUrls,
        friends: friendList,
        tags: tagList,
        status: stampStatus,
      };
      const formData = new FormData();
      if (uploadedImages != null) {
        uploadedImages.forEach((file) => {
          formData.append('stamp-images', file);
        });
      }
      formData.append('stamp-data', JSON.stringify(updateStampDto));

      const res = await api.patch('/stamp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(AuthActionEnum.UPDATE_STAMP, res.data);
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

          {/* <Image
              src={BASE_URL + '/' + userIcon.Icon.url}
              alt={`stamp modify modal ${userIcon.Icon.id}`}
              className="h-auto object-contain aspect-square"
              priority
              width={50}
              height={50}
            /> */}
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
            <DateTimeHapp
              className={`${openTimeMover ? 'block' : 'hidden'}`}
              stampedAt={stampedAt}
              setStampedAt={setStampedAt}
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
            <div className="flex items-center bg-primary-hover rounded p-2 justify-between">
              <div>
                <SelectHapp
                  options={options}
                  selected={stampStatus}
                  onSelected={setStampStatus}
                ></SelectHapp>
              </div>
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
            onClick={updateStamp}
          >
            {Language.$t.Button.Save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(StampModifyModal);
