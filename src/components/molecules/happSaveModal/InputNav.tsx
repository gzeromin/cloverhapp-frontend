'use client';
import { Dispatch, memo, SetStateAction } from 'react';
import { TbPhoto } from 'react-icons/tb';
import { GoPeople, GoTag } from 'react-icons/go';
import { TfiPencilAlt } from 'react-icons/tfi';
import { MdAttachMoney } from 'react-icons/md';
import cls from 'classnames';
import { LuCopyPlus, LuGlassWater } from 'react-icons/lu';
import { StampStatus, StampType } from '@/types/Stamp';
import { WiTime7 } from 'react-icons/wi';
import { BsCheckCircle } from 'react-icons/bs';
import { RxLockClosed, RxLockOpen2 } from 'react-icons/rx';
import SelectHapp from '@/components/atoms/SelectHapp';
import { RiLinksLine } from 'react-icons/ri';
import { BiBook } from 'react-icons/bi';

export const statusOptions = [
  {
    value: StampStatus.PRIVATE,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.PRIVATE,
    icon: <RxLockClosed />,
  },
  {
    value: StampStatus.FRIEND,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.FRIEND,
    icon: <GoPeople />,
  },
  {
    value: StampStatus.PUBLIC,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.PUBLIC,
    icon: <RxLockOpen2 />,
  },
];

interface Props {
  type: StampType | undefined;
  stampStatus: StampStatus;
  setStampStatus: Dispatch<SetStateAction<StampStatus>>;
  openTime: boolean;
  setOpenTime: (open: boolean) => void;
  openWater: boolean;
  setOpenWater: (open: boolean) => void;
  openBook: boolean;
  setOpenBook: (open: boolean) => void;
  openMoney: boolean;
  setOpenMoney: (open: boolean) => void;
  openMemo?: boolean;
  setOpenMemo?: (open: boolean) => void;
  openUploadPhoto: boolean;
  setOpenUploadPhoto: (open: boolean) => void;
  existPhoto: boolean | undefined;
  openFriends: boolean;
  setOpenFriends: (open: boolean) => void;
  openTags: boolean;
  setOpenTags: (open: boolean) => void;
  openTodo?: boolean;
  setOpenTodo?: (open: boolean) => void;
  openCopy?: boolean;
  setOpenCopy?: (open: boolean) => void;
}

export const OPEN_TIME = [
  StampType.MEDITATION,
  StampType.STUDY,
  StampType.EXERCISE,
  StampType.BOOK,
];

export const OPEN_MONEY = [
  StampType.MEAL,
  StampType.INCOME,
  StampType.EXPENSE,
];

export const OPEN_MEMO = Object.values(StampType);

export const OPEN_UPLOAD_PHOTO = Object.values(StampType);

export const OPEN_TODO = Object.values(StampType);

const InputNav: React.FC<Props> = ({
  type,
  stampStatus,
  setStampStatus,
  openTime,
  setOpenTime,
  openWater,
  setOpenWater,
  openBook,
  setOpenBook,
  openMoney,
  setOpenMoney,
  openMemo,
  setOpenMemo,
  openUploadPhoto,
  setOpenUploadPhoto,
  existPhoto,
  openFriends,
  setOpenFriends,
  openTags,
  setOpenTags,
  openTodo,
  setOpenTodo,
  openCopy,
  setOpenCopy,
}) => {
  return (
    <div className="flex gap-3 justify-end items-center bg-primary-hover rounded p-2 mb-2">
      <SelectHapp
        className='text-base grow'
        options={statusOptions}
        selected={stampStatus}
        onSelected={setStampStatus}
      />
      <WiTime7 
        className={cls(
          'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
          {
            'text-primary': openTime,
          },
        )}
        onClick={() => setOpenTime(!openTime)}
      />
      {type && type == StampType.WATER && (
        <LuGlassWater 
          className={cls(
            'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
            {
              'text-primary': openWater,
            },
          )}
          onClick={() => setOpenWater(!openWater)}
        />
      )}
      {type && type == StampType.BOOK && (
        <BiBook 
          className={cls(
            'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
            {
              'text-primary': openBook,
            },
          )}
          onClick={() => setOpenBook(!openBook)}
        />
      )}
      {type && OPEN_MONEY.includes(type) && (
        <MdAttachMoney 
          className={cls(
            'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
            {
              'text-primary': openMoney,
            },
          )}
          onClick={() => setOpenMoney(!openMoney)}
        />
      )}
      {setOpenMemo && type && OPEN_MEMO.includes(type) && (
        <TfiPencilAlt 
          className={cls(
            'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
            {
              'text-primary': openMemo,
            },
          )}
          onClick={() => setOpenMemo(!openMemo)}
        />
      )}
      {type && OPEN_UPLOAD_PHOTO.includes(type) && (
        <TbPhoto
          className={cls(
            'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
            {
              'text-primary':
                          openUploadPhoto || existPhoto,
            },
          )}
          onClick={() => setOpenUploadPhoto(!openUploadPhoto)}
        />
      )}
      <RiLinksLine
        className={cls(
          'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
          {
            'text-primary': openFriends,
          },
        )}
        onClick={() => setOpenFriends(!openFriends)}
      />
      <GoTag
        className={cls(
          'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
          {
            'text-primary': openTags,
          },
        )}
        onClick={() => setOpenTags(!openTags)}
      />
      {setOpenTodo && type && OPEN_TODO.includes(type) && (
        <BsCheckCircle
          className={cls(
            'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
            {
              'text-primary': openTodo,
            },
          )}
          onClick={() => setOpenTodo(!openTodo)}
        />
      )}
      {setOpenCopy && (
        <LuCopyPlus 
          className={cls(
            'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
            {
              'text-primary': openCopy,
            },
          )}
          onClick={() => setOpenCopy(!openCopy)}
        />
      )}
    </div>
  );
};

export default memo(InputNav);