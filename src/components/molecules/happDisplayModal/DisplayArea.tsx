'use client';
import { memo } from 'react';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { SHOW_TYPE } from './DisplayNav';
import CarouselHapp from '@/components/atoms/CarouselHapp';

interface Props {
  showType: SHOW_TYPE | undefined;
  memo: string | null;
  imageUrls: string[] | undefined;
  collapsed: boolean;
}

const DisplayArea: React.FC<Props> = ({
  showType,
  memo,
  imageUrls,
  collapsed,
}) => {
  return (
    <div className={cls(
      'flex flex-col gap-1',
      'transition-all duration-500 ease-in-out overflow-hidden relative',
      `${collapsed ? 'h-0 opacity-0': 'h-[200px] opacity-100'}`
    )}>
      {/* Memo */}
      <div 
        className={cls(
          `${showType == SHOW_TYPE.Memo ? 'opacity-100' : 'opacity-0'}`,
          'h-[200px] overflow-y-auto',
          'absolute inset-0 transition-opacity duration-500 ease-in-out',
          'flex gap-2 whitespace-pre-wrap text-base',
        )}
      >
        {memo}
      </div>
      {/* Photo */}
      {imageUrls && (
        <CarouselHapp
          className={cls(
            `${showType == SHOW_TYPE.Photo ? 'opacity-100' : 'opacity-0'}`,
            'absolute inset-0 transition-opacity duration-500 ease-in-out',
          )}
          imageUrls={imageUrls}
        />
      )}
    </div>
  );
};

export default memo(observer(DisplayArea));