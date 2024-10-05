'use client';
import TextareaHapp from '@/components/atoms/TextareaHapp';
import { memo, useState } from 'react';
import cls from 'classnames';
import { RiSave3Fill } from 'react-icons/ri';

interface Props {}

const Memo: React.FC<Props> = () => {
  const [memo, setMemo] = useState('');

  return (
    <div 
      className="flex flex-col p-3"
      test-id="memoPage"
    >
      <RiSave3Fill 
        className={cls(
          'text-gray-500 cursor-pointer text-2xl', 
          'mr-2 hover:text-primary',
          'absolute right-0 top-1'
        )}
      />
      <TextareaHapp
        rows={21}
        className={'h-[530px] overflow-y-auto'}
        placeholder={''}
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        autoHeight={true}
        border={false}
        marginBottom=""
        textAreaClassName={cls(
          'bg-transparent',
          'whitespace-pre-wrap' // 개행 유지
        )}
      />
    </div>
  );
};

export default memo(Memo);