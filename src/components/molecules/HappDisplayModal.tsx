'use client';
import { Happ } from '@/types/Happ';
import api, { BASE_URL } from '@/utils/api.util';
import { useEffect, useState } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import { Language } from '@/mobx/index';
import TextareaHapp from '../atoms/TextareaHapp';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { useAuthState } from '@/context/auth';
import UserProrile from './UserProrile';
import { useRouter } from 'next/navigation';
import CarouselHapp from '../atoms/CarouselHapp';
import CommentHapp from '../atoms/CommentHapp';

interface HappDisplayModalProps {
  happId: string;
  closeModal: () => void;
}

const HappDisplayModal: React.FC<HappDisplayModalProps> = ({
  happId,
  closeModal,
}) => {
  const { user } = useAuthState();
  const router = useRouter();
  const [happ, setHapp] = useState<Happ>();

  useEffect(() => {
    api.get('/happ/' + happId).then((res) => {
      setHapp(res.data);
    });
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
        <div className="flex justify-between items-center border-b border-light-gray p-3">
        
          {/* <Image
            src={BASE_URL + '/' + userStamp.Stamp.url}
            alt={`stamp modify modal ${userStamp.Stamp.id}`}
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
          <div className="flex gap-1">
            <TextareaHapp
              placeholder={Language.$t.Placeholder.Description}
              className="grow text-lg"
              rows={2}
              value={happ && happ.memo}
              border={false}
              resizable={false}
              autoHeight={true}
              disable={true}
            />
            {happ && happ.User && (
              <div className="flex flex-col items-center justify-center">
                <UserProrile
                  user={happ.User}
                  alt={`happ feed profile image ${happ.id}`}
                  size={110}
                  className="mr-1 rounded-full cursor-pointer hover:bg-primary-hover"
                  onClickProfile={() => router.push('/c/' + happ.User.id)}
                />
                <span className="text-sm font-thin">{happ.User.nickname}</span>
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

export default observer(HappDisplayModal);
