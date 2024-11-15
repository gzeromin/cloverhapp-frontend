'use client';
import { Happ } from '@/types/Happ';
import api, { BASE_URL } from '@/utils/api.util';
import { useEffect, useState } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import { Language } from '@/mobx/index';
import TextareaHapp from '@/components/molecules/TextareaHapp';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { useAuthState } from '@/context/auth';
import UserProrile from '@/components/molecules/UserProrile';
import { useRouter } from 'next/navigation';
import CarouselHapp from '@/components/atoms/CarouselHapp';
import CommentHapp from '@/components/atoms/CommentHapp';
import { handleError } from '@/utils/error.util';
import Image from 'next/image';

interface HappDisplayModalProps {
  happId: string | null;
  closeModal: () => void;
}

const HappDisplayModalBak: React.FC<HappDisplayModalProps> = ({
  happId,
  closeModal,
}) => {
  const { user } = useAuthState();
  const router = useRouter();
  const [happ, setHapp] = useState<Happ>();

  useEffect(() => {
    api.get('/happ/' + happId).then((res) => {
      setHapp(res.data);
    }).catch((error) => { handleError(error); });
  }, [happId]);

  return (
    <div className="z-50 fixed inset-0 w-full h-full flex flex-col items-center justify-center">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-50"
        onClick={closeModal}
      >
        {/* Background opacity */}
      </div>
      <div className="z-50 box-border shadow-lg min-w-[500px] max-w-[600px] bg-white border border-light-black rounded-lg text-2xl">
        {/* header */}
        <div className="relative flex p-3 pb-0">
          {happ && happ.User && (
            <div className="flex items-center justify-center gap-2">
              <UserProrile
                user={happ.User}
                alt={`happ feed profile image ${happ.id}`}
                size={40}
                className="m-1 rounded-full cursor-pointer hover:bg-primary-hover"
                onClickProfile={() => router.push('/c/' + happ.User.id)}
              />
              <span className="text-sm font-normal">{happ.User.nickname}</span>
            </div>
          )}
          <AiFillCloseSquare
            className={cls(
              'text-primary cursor-pointer text-3xl', 
              'mr-2 hover:text-primary-hover',
              'absolute right-0'
            )}
            onClick={closeModal}
          />
        </div>

        {/* body */}
        <div className="p-4 max-h-4/5 overflow-y-auto">
          <div className="flex gap-3">
            {happ && (
              <div className={cls('flex items-center w-full gap-2')}>
                <Image
                  src={happ.UserStamp.Stamp.url}
                  alt={`happ display modal ${happ.id}`}
                  className="h-auto object-contain aspect-square"
                  width={90}
                  height={90}
                />
                <TextareaHapp
                  id="happDisplayModal-description"
                  className="grow text-lg"
                  placeholder={Language.$t.Placeholder.Memo}
                  value={happ.memo}
                  border={true}
                  textAreaClassName={cls('border-dashed border-2 border-gray-100')}
                  resizable={false}
                  disable={true}
                  marginBottom='mb-0'
                />
              </div>
            )}
          </div>

          {happ && happ.imageUrls && happ.imageUrls.length > 0 && (
            <CarouselHapp
              className=""
              imageUrls={happ.imageUrls.map((url) => BASE_URL + '/' + url)}
            />
          )}

          {/* Tags */}
          <div className={cls('grow flex flex-wrap items-center gap-2')}>
            {happ &&
              happ.Tags?.map((tag, index) => (
                <div
                  key={`tagList ${tag.id} ${index}`}
                  className="flex rounded-full items-center gap-1 text-nowrap hover:bg-primary-hover hover:cursor-pointer"
                >
                  <span className="text-sm">#</span>
                  <span className="text-sm mr-1">{tag.name}</span>
                </div>
              ))}
          </div>

          {/* Comments */}
          <CommentHapp
            user={user}
            happId={happId}
            Comments={happ && happ.Comments}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(HappDisplayModalBak);
