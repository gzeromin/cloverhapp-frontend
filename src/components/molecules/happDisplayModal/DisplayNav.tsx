'use client';
import { memo, useEffect, useState } from 'react';
import { TbPhoto } from 'react-icons/tb';
import cls from 'classnames';
import { StampStatus } from '@/types/Stamp';
import { RxLockClosed, RxLockOpen2 } from 'react-icons/rx';
import { GoChevronDown, GoChevronUp, GoPeople } from 'react-icons/go';
import { TfiPencilAlt } from 'react-icons/tfi';
import { Language } from '@/mobx';
import { observer } from 'mobx-react-lite';


interface Props {
  happStatus: StampStatus | undefined;
  showType: SHOW_TYPE | undefined;
  setShowType: (type: SHOW_TYPE) => void;
  memo: string | null;
  imageUrls: string[];
  collapsed: boolean;
  toggleCollapse: () => void;
}

export enum SHOW_TYPE {
  Photo = 'Photo',
  Memo = 'Memo'
};

const DisplayNav: React.FC<Props> = ({
  happStatus,
  showType,
  setShowType,
  memo,
  imageUrls,
  collapsed,
  toggleCollapse,
}) => {
  const [showMemoIcon, setShowMemoIcon] = useState<boolean>(false);
  const [showPhotoIcon, setShowPhotoIcon] = useState<boolean>(false);
  const [showCollapseIcon, setShowCollapseIcon] = useState<boolean>(false);

  useEffect(() => {
    let memoIcon = false;
    let photoIcon = false;
    if (memo && memo.trim() != '') {
      memoIcon = true;
      setShowMemoIcon(true);
    }
    if (imageUrls && imageUrls.length > 0) {
      photoIcon = true;
      setShowPhotoIcon(true);
    }
    if(memoIcon || photoIcon) {
      setShowCollapseIcon(true);
      toggleCollapse();
    }
  }, [memo, imageUrls]);

  const getHappStatus = (happStatus: StampStatus) => {
    switch(happStatus) {
    case StampStatus.PRIVATE:
      return (
        <RxLockClosed />
      );
    case StampStatus.FRIEND:
      return (
        <GoPeople />
      );
    case StampStatus.PUBLIC:
      return (
        <RxLockOpen2 />
      );
    }
    return null;
  };

  return (
    <div className={cls(
      'relative p-2 mb-2 min-h-[40px]',
      'flex justify-between items-center',
      'bg-primary-hover rounded'
    )}>
      {/* left */}
      <div className='flex gap-3'>
        {showMemoIcon && (
          <TfiPencilAlt 
            className={cls(
              'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
              {
                'text-primary': showType == SHOW_TYPE.Memo,
              },
            )}
            onClick={() => setShowType(SHOW_TYPE.Memo)}
          />
        )}
        {showPhotoIcon && (
          <TbPhoto
            className={cls(
              'text-gray-600 rounded cursor-pointer hover:bg-primary-hover',
              {
                'text-primary': showType == SHOW_TYPE.Photo,
              },
            )}
            onClick={() => setShowType(SHOW_TYPE.Photo)}
          />
        )}
      </div>
      {/* right */}
      <div className='flex gap-2'>
        { happStatus && (
          <div className={cls(
            'flex items-center gap-1',
            'text-blue-700 text-xl'
          )}>
            { getHappStatus(happStatus) }
            <span className='text-sm'>
              { Language.$t.StampStatus[happStatus]}
            </span>
          </div>
          
        )}
        {showCollapseIcon && (
          <div 
            className='text-green-700 cursor-pointer'
            onClick={toggleCollapse}
          >
            {collapsed ? (
              <GoChevronDown />
            ) : (
              <GoChevronUp />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(observer(DisplayNav));