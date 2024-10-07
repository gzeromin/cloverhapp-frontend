'use client';
import TextareaHapp from '@/components/atoms/TextareaHapp';
import { memo, useEffect, useState } from 'react';
import cls from 'classnames';
import { RiSave3Fill } from 'react-icons/ri';
import { observer } from 'mobx-react-lite';
import { TimeCtrllor } from '@/mobx';
import { useAuthState } from '@/context/auth';
import api from '@/utils/api.util';
import { Memo } from '@/types/Memo';

interface Props {}

const MemoPage: React.FC<Props> = () => {
  const { user } = useAuthState();
  // const [memos, setMemos] = useState<Memo[]>([]);
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if(user)
      api
        .get(`/memo/${TimeCtrllor.formattedSelectedDate}/${user.id}`)
        .then((res) => {
          // setMemos(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
  }, [TimeCtrllor.formattedSelectedDate, user]);

  return (
    <div 
      className="flex flex-col pt-4"
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
          'whitespace-pre-wrap', // 개행 유지
          'text-sm'
        )}
      />
    </div>
  );
};

export default memo(observer(MemoPage));