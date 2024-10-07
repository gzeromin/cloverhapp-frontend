'use client';
import { useAuthState } from '@/context/auth';
import { Dialog, Language, Loading } from '@/mobx/index';
import { AiFillCloseSquare } from 'react-icons/ai';
import api from '@/utils/api.util';
import { memo, useEffect, useState } from 'react';
import { User } from '@/types/User';
import { observer } from 'mobx-react-lite';
import UserProrile from '@/components/molecules/UserProrile';
import InputHapp from '@/components/atoms/InputHapp';
import TextareaHapp from '@/components/atoms/TextareaHapp';

interface RequestModalProps {
  friendUser: User | undefined;
  closeModal: () => void;
  mutate: () => void;
}

const _RequestModal: React.FC<RequestModalProps> = ({
  friendUser,
  closeModal,
  mutate,
}) => {
  const { user } = useAuthState();

  const [myAlias, setMyAlias] = useState<string | undefined>('');
  const [friendAlias, setFriendAlias] = useState<string | undefined>('');
  const [requestMessage, setRequestMessage] = useState<string | undefined>('');

  useEffect(() => {
    setFriendAlias(friendUser?.nickname);
    setMyAlias(user?.nickname);
  }, []);

  const requestFriend = async () => {
    Loading.setIsLoading(true);
    try {
      if (user && friendUser) {
        await api.post('/notif/request-friend', {
          senderId: user.id,
          receiverId: friendUser.id,
          myAlias,
          friendAlias,
          requestMessage,
        });
        const dialogResult = await Dialog.openDialog(
          Dialog.SUCCESS,
          Language.$t.Success.RequestFriend,
        );
        if (dialogResult) {
          mutate();
          closeModal();
        }
      }
    } catch (error) {
      // TODO
      // handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="fixed z-50 inset-0 w-full h-full flex flex-col items-center justify-center">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-50"
        onClick={closeModal}
      >
        {/* Background opacity */}
      </div>
      <div className="z-50 box-border shadow-lg min-w-[300px] bg-white border border-light-black rounded-lg text-2xl">
        {/* header */}
        <div className="flex justify-between items-center border-b border-light-gray p-3">
          <p className="pl-1">{Language.$t.Modal.RequestFriend}</p>
          <AiFillCloseSquare
            className="text-primary cursor-pointer"
            onClick={closeModal}
          />
        </div>
        {/* body */}
        {friendUser && (
          <div className="p-4 flex flex-col justify-center">
            <p className="text-2xl font-normal">
              {Language.$t.Variable1.RequestFriend.replace(
                '{value}',
                friendUser.nickname,
              )}
            </p>
            <div className="flex items-center gap-4">
              <div className="text-center mb-4">
                <UserProrile
                  user={friendUser}
                  alt={friendUser.id}
                  size={200}
                  className="m-auto p-1 object-cover aspect-square"
                />
                <p className="text-sm text-gray-600">{friendUser.email}</p>
              </div>
              <div>
                <InputHapp
                  className="grow"
                  labelName={Language.$t.Input.MyAlias}
                  placeholder={Language.$t.Input.MyAlias}
                  value={myAlias}
                  onChange={(e) => setMyAlias(e.target.value)}
                  marginBottom=""
                />
                <InputHapp
                  className="grow"
                  labelName={Language.$t.Input.FriendAlias}
                  placeholder={Language.$t.Input.FriendAlias}
                  value={friendAlias}
                  onChange={(e) => setFriendAlias(e.target.value)}
                  marginBottom="mb-2"
                />
                <TextareaHapp
                  labelName={Language.$t.Input.RequestMessage}
                  rows={3}
                  value={requestMessage}
                  onChange={(e) => setRequestMessage(e.target.value)}
                  marginBottom=""
                  border={true}
                />
              </div>
            </div>
          </div>
        )}
        {/* footer */}
        <div className="grid grid-flow-col justify-stretch p-1 border-t border-light-gray">
          <button
            className="m-1 border rounded-lg bg-cancel py-1.5 px-3 text-white font-extralight text-lg"
            onClick={closeModal}
          >
            {Language.$t.Button.Cancel}
          </button>
          <button
            className="m-1 border rounded-lg bg-primary py-1.5 px-3 text-white font-extralight text-lg"
            onClick={requestFriend}
          >
            {Language.$t.Button.Request}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(observer(_RequestModal));
