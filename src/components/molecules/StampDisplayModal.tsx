'use client';
import { Stamp } from '@/types/Stamp';
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

interface StampDisplayModalProps {
  stampId: string;
  closeModal: () => void;
}

const StampDisplayModal: React.FC<StampDisplayModalProps> = ({
  stampId,
  closeModal,
}) => {
  const { user } = useAuthState();
  const router = useRouter();
  const [stamp, setStamp] = useState<Stamp>();

  useEffect(() => {
    api.get('/stamp/' + stampId).then((res) => {
      setStamp(res.data);
    });
  }, [stampId]);

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
            src={BASE_URL + '/' + userIcon.Icon.url}
            alt={`stamp modify modal ${userIcon.Icon.id}`}
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
          {/* Friends */}
          <div className="grow flex flex-wrap items-center gap-2">
            {stamp &&
              stamp.Friends?.map((friend, index) => (
                <div
                  key={`friendList ${friend.id} ${index}`}
                  className="flex gap-1 rounded-full items-center text-nowrap hover:bg-primary-hover hover:cursor-pointer group"
                >
                  <span className="text-sm">@</span>
                  <UserProrile
                    user={friend.Friend}
                    alt={`friendList userProfile ${friend.id} ${index}`}
                    size={30}
                    className="rounded-full"
                  />
                  <span className="text-sm mr-1">{friend.alias}</span>
                </div>
              ))}
          </div>
          <div className="flex gap-1">
            <TextareaHapp
              placeholder={Language.$t.Placeholder.Description}
              className="grow text-lg"
              rows={2}
              value={stamp && stamp.memo}
              border={false}
              resizable={false}
              autoHeight={true}
              disable={true}
            />
            {stamp && stamp.User && (
              <div className="flex flex-col items-center justify-center">
                <UserProrile
                  user={stamp.User}
                  alt={`stamp feed profile image ${stamp.id}`}
                  size={110}
                  className="mr-1 rounded-full cursor-pointer hover:bg-primary-hover"
                  onClickProfile={() => router.push('/c/' + stamp.User.id)}
                />
                <span className="text-sm font-thin">{stamp.User.nickname}</span>
              </div>
            )}
          </div>

          {stamp && stamp.imageUrls && stamp.imageUrls.length > 0 && (
            <CarouselHapp
              className=""
              imageUrls={stamp.imageUrls.map((url) => BASE_URL + '/' + url)}
            />
          )}

          {/* Tags */}
          <div className={cls('grow flex flex-wrap items-center gap-2')}>
            {stamp &&
              stamp.Tags?.map((tag, index) => (
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
            stampId={stampId}
            Comments={stamp && stamp.Comments}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(StampDisplayModal);
