'use client';

import { Language, Loading } from '@/mobx';
import api, { BUCKET_URL } from '@/utils/api.util';
import { handleError } from '@/utils/error.util';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import cls from 'classnames';
import { Tag } from '@/types/Tag';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import { Stamp } from '@/types/Stamp';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import TagHapp from '@/components/atoms/TagHapp';

interface Props {
  params: { stampId: string };
}

const StampDownloadPage: React.FC<Props> = ({ params }: Props) => {
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();
  const { stampId } = params;
  const [stamp, setStamp] = useState<Stamp>();
  const [tags, setTags] = useState<Tag[]>([]);

  const router = useRouter();

  useEffect(() => {
    api.get('/stamp/' + stampId).then((res) => {
      const data: Stamp = res.data;
      setStamp(data);
      setTags(data.Tags);
    }).catch((error) => {
      handleError(error);
    });
  }, [stampId]);

  const downloadStamp = async () => {
    Loading.setIsLoading(true);
    try {
      if (stamp) {
        const res = await api.post('/user-stamp', {
          stampId: stamp.id,
          stampStatus: stamp.status,
          registerId: stamp.userId,
          droplet: stamp.droplet,
          name: stamp.name,
          description: stamp.description,
        });
        Loading.setIsLoading(false);
        dispatch(AuthActionEnum.SET_DROPLET, res.data?.droplet);
        dispatch(AuthActionEnum.SET_USER_STAMPS, res.data?.userStamps);
        router.back();
      }
    } catch(error) {
      Loading.setIsLoading(false);
      handleError(error);
    }
  };

  const deleteStamp = async () => {
    Loading.setIsLoading(true);
    try {
      if (stamp) {
        await api.delete('/stamp/' + stamp.id);
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className={cls(
      'relative h-[80vh] overflow-y-auto',
      'flex flex-col items-center justify-center'
    )}>
      {/* header */}
      <div className={cls(
        'absolute top-[30px] left-[30px] w-11/12', 
        'flex items-center justify-between gap-10'
      )}>
        <IoArrowUndoCircleOutline
          className="text-6xl text-primary hover:text-primary-hover cursor-pointer"
          onClick={() => router.back()}
        />
      </div>

      {/* body */}
      {stamp && (
        <div className="w-full p-4">
          {/* 1 열 */}
          <div className={cls('flex items-center justify-between')}>
            {/* Icon Image */}
            <div className={cls('w-1/2 relative')}>
              {stamp.notForSale && (
                <p className={cls(
                  'absolute right-0 m-3',
                  'bg-blue-50 text-blue-700 border border-blue-700',
                  'rounded-md text-xs px-1 cursor-default',
                )}>
                  {Language.$t.Stamp.Default}
                </p>
              )}
              <Image
                src={stamp.url}
                alt={stamp.id}
                className="m-auto p-6 object-contain aspect-square"
                priority={false}
                width={250}
                height={250}
              />
            </div>

            {/* Info */}
            <div className={cls('w-1/2 flex flex-col gap-3')}>
              <p className="text-4xl font-semibold text-center">{stamp.name}</p>
              <p className="text-base text-gray-400 text-end">
                { stamp.Register && stamp.Register.nickname}
              </p>
              <div className="flex items-center pt-6">
                <Image
                  src={`${BUCKET_URL}/public/icons/droplet.png`}
                  alt="droplet"
                  className=""
                  width={40}
                  height={40}
                ></Image>
                <p className="text-2xl">{stamp.droplet}</p>
              </div>
              {stamp.description && (
                <div className={cls(
                  'p-2 rounded-md', 
                  'border-2 border-gray-100 border-dashed'
                )}>
                  {stamp.description}
                </div>
              )}
              <div className={cls('flex items-center gap-2')}>
                {tags.map((e) => <TagHapp key={`stamp-${stamp.id} tag-${e.id}`} name={e.name} />)}
              </div>
            </div>
          </div>

          {/* 2 열 */}
        </div>
      )}

      {/* footer */}
      <div className={cls(
        'absolute w-full bottom-0 p-5',
        'grid grid-flow-col items-center justify-stretch gap-5', 
      )}>
        {user && stamp && user.id === stamp.userId && (
          <button
            className={cls(
              'm-1 py-1.5 px-3 rounded-lg text-lg',
              'tracking-wider font-bold text-white uppercase',
              'bg-red-700 border border-red-700', 
              'hover:bg-red-100 hover:text-red-700',
              'transition-colors duration-300 ease-in-out'
            )}
            onClick={deleteStamp}
          >
            {Language.$t.Button.Delete}
          </button> 
        )}
        {user && stamp && user.id === stamp.userId && (
          <button
            className={cls(
              'm-1 py-1.5 px-3 rounded-lg text-lg',
              'tracking-wider font-bold text-white uppercase',
              'bg-green-700 border border-green-700', 
              'hover:bg-green-100 hover:text-green-700',
              'transition-colors duration-300 ease-in-out'
            )}
            onClick={() => router.push('./' + stampId + '/update')}
          >
            {Language.$t.Button.Edit}
          </button>
        )}
        <button
          className={cls(
            'm-1 py-1.5 px-3 rounded-lg text-lg',
            'tracking-wider font-bold text-white uppercase',
            'bg-cancel border border-cancel', 
            'hover:bg-gray-100 hover:text-cancel',
            'transition-colors duration-300 ease-in-out'
          )}
          onClick={() => router.back()}
        >
          {Language.$t.Button.Cancel}
        </button>
        <button 
          className={cls(
            'm-1 py-1.5 px-3 rounded-lg text-lg',
            'tracking-wider font-bold text-white uppercase',
            'bg-primary border border-primary', 
            'hover:bg-primary-hover hover:text-primary',
            'transition-colors duration-300 ease-in-out'
          )}
          onClick={downloadStamp}  
        >
          {Language.$t.Button.Purchase}
        </button>
      </div>
    </div>
  );
};

export default memo(observer(StampDownloadPage));