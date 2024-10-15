'use client';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import { Dialog, Language, Loading } from '@/mobx';
import { KeyValue } from '@/enums/KeyValue';
import { observer } from 'mobx-react-lite';
import { memo, useEffect, useState } from 'react';
import CheckHapp from '@/components/atoms/CheckHapp';
import cls from 'classnames';
import { notoSans } from '@/styles/fonts';
import api from '@/utils/api.util';
import { handleError } from '@/utils/error.util';
import { useRouter } from 'next/navigation';

interface Props {}

const KeyValueList: React.FC<Props> = () => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const router = useRouter();

  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    if (user && user.keyValues) {
      setSelectedValues(user.keyValues);
    }
  }, [user]);

  const handleCheckboxChange = (key: string) => {
    if (selectedValues.includes(key)) {
      setSelectedValues(selectedValues.filter((value) => value !== key));
    } else {
      if (selectedValues.length < 7) {
        setSelectedValues([...selectedValues, key]);
      } else {
        // 이미 7개가 선택된 경우 경고 메시지 표시
        Dialog.openDialog(
          Dialog.WARNING,
          Language.$t.Variable1.MaxLength.replace('{value}', 7),
        );
      }
    }
  };

  const saveKeyValue = async () => {
    Loading.setIsLoading(true);
    try {
      await api.post('/auth/key-value', { keyValues: selectedValues });
      dispatch(AuthActionEnum.SET_KEY_VALUE, selectedValues);
      router.push('/user/keyValue');
    } catch (error: any) {
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className={cls(
      'flex flex-col items-center h-screen overflow-y-auto pt-20 pb-32',
      notoSans.className
    )}>
      <div className={cls(
        'flex sticky top-0 z-10 p-2 gap-2 text-2xl mb-6',
        Language.logoFont
      )}>
        <div className='bg-white bg-opacity-50'>
          {Language.$t.ModalPage.KeyValue}
        </div>
        <button 
          className={cls(
            'bg-primary-hover text-primary rounded-lg px-1 shadow-lg',
            'hover:bg-primary hover:text-white',
            'transition-transform transform hover:scale-105'
          )}
          onClick={saveKeyValue}
        >
          {Language.$t.Button.Save}
        </button>
        <button 
          className={cls(
            'bg-amber-100 text-amber-600 rounded-lg px-1 shadow-lg',
            'hover:bg-amber-600 hover:text-white',
            'transition-transform transform hover:scale-105'
          )}
          onClick={() => router.push('/user/keyValue')}
        >
          {Language.$t.Button.Skip}
        </button>
      </div>
      <div className={cls('grid grid-cols-3 nm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 lx:grid-cols-8 gap-2')}>
        {Object.keys(KeyValue).map((key) => (
          <div 
            key={key}
            className={cls(
              'flex bg-white transition-transform transform hover:scale-125 hover:z-20',
              'p-1 rounded-md shadow-md hover:p-2'
            )}
            onClick={() => handleCheckboxChange(key)}
          >
            <CheckHapp
              labelName={Language.$t.KeyValue[key]}
              className={cls('flex flex-row-reverse grow justify-between px-1')}
              checked={selectedValues.includes(key)}
              onChange={() => handleCheckboxChange(key)}
              marginBottom='mb-0'
              grow={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(observer(KeyValueList));
