'use client';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import { Dialog, Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { memo, useEffect, useState } from 'react';
import cls from 'classnames';
import KeyValueHapp from '@/components/atoms/KeyValueHapp';
import TextareaHapp from '@/components/atoms/TextareaHapp';
import { useRouter } from 'next/navigation';
import { PiShareFat, PiShareFatFill } from 'react-icons/pi';
import api from '@/utils/api.util';
import { handleError } from '@/utils/error.util';

interface Props {}

const KeyValue: React.FC<Props> = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const [sentence, setSentence] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (user && user.sentence) {
      setSentence(user.sentence);
    }
  }, [user]);

  const saveSentence = async () => {
    Loading.setIsLoading(true);
    try {
      await api.post('/auth/sentence', { sentence });
      dispatch(AuthActionEnum.SET_SENTENCE, sentence);
      Dialog.openDialog(Dialog.SUCCESS, Language.$t.Success.Sentence);
    } catch (error: any) {
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div 
        className={cls(
          'flex items-center gap-2 cursor-pointer group px-1',
          'transition duration-200 text-green-700',
          'hover:font-bold hover:bg-gray-100 rounded-lg'
        )}
        onClick={() => router.push('/modalPage/keyValue')}
      >
        {Language.$t.Label.SettingKeyValue}
        <PiShareFat className='group-hover:hidden'/>
        <PiShareFatFill className='hidden group-hover:block' />
      </div>
      <div 
        className={cls(
          'mb-10 p-2 flex flex-wrap gap-2 justify-evenly',
        )}
      >
        { user && user.keyValues 
          && user.keyValues.map((e, index) => <KeyValueHapp 
            key={`keyValue ${e} ${index}`} 
            value={e}
          />)}
      </div>
      <div className={cls('w-full flex justify-between mb-1')}>
        <div
          className={cls(
            'text-amber-700',
          )}
        >
          {Language.$t.TextArea.Sentence}
        </div>
        <button
          className={cls(
            'text-amber-50 bg-amber-700 rounded-lg px-1 shadow-sm',
            'hover:bg-amber-100 hover:text-amber-700'
          )}
          onClick={saveSentence}
        >
          {Language.$t.Button.Save}
        </button>
      </div>
      <TextareaHapp
        rows={7}
        className={'h-[220px] overflow-y-auto rounded-md w-11/12 border-2 border-amber-600'}
        placeholder={''}
        value={sentence}
        onChange={(e) => setSentence(e.target.value)}
        autoHeight={true}
        border={false}
        marginBottom=""
        textAreaClassName={cls(
          'bg-transparent',
          'text-xl tracking-widest text-center',
          Language.logoFont
        )}
      />
    </div>
  );
};

export default memo(observer(KeyValue));
