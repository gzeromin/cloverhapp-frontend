'use client';
import { Dialog, Language, Loading } from '@/mobx/index';
import { AiFillCloseSquare } from 'react-icons/ai';
import api, { fetcher } from '@/utils/api.util';
import { memo, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Friend } from '@/types/Friend';
import useSWR from 'swr';
import InputHapp from '@/components/molecules/InputHapp';
import TextareaHapp from '@/components/molecules/TextareaHapp';

interface ChangeAliasModalProps {
  friend: Friend | undefined;
  closeModal: () => void;
  mutate: () => void;
}

const _ChangeAliasModal: React.FC<ChangeAliasModalProps> = ({
  friend,
  closeModal,
  mutate,
}) => {
  const [myAlias, setMyAlias] = useState<string | undefined>('');
  const [friendAlias, setFriendAlias] = useState<string | undefined>('');
  const [requestMessage, setRequestMessage] = useState<string | undefined>('');

  const { data: user } = useSWR<Friend | undefined>(
    `/friend/one?userId=${friend?.friendId}&friendId=${friend?.userId}`,
    fetcher,
    {
      dedupingInterval: 2000,
    },
  );

  useEffect(() => {
    setFriendAlias(friend?.alias);
    setMyAlias(user?.alias);
  }, [user]);

  const requestFriend = async () => {
    Loading.setIsLoading(true);
    try {
      if (user && friend) {
        await api.post('/notif/request-friend', {
          senderId: user.id,
          receiverId: friend.id,
          friendAlias,
          myAlias,
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
          <p className="pl-1">{Language.$t.Modal.ChangeAlias}</p>
          <AiFillCloseSquare
            className="text-primary cursor-pointer"
            onClick={closeModal}
          />
        </div>
        {/* body */}
        {friend && (
          <div className="px-4 flex flex-col justify-center">
            <InputHapp
              id="changeAliasModal-friendAlias"
              className="grow"
              labelName={Language.$t.Input.FriendAlias}
              placeholder={Language.$t.Input.FriendAlias}
              value={friendAlias}
              onChange={(e) => setFriendAlias(e.target.value)}
            />
            <InputHapp
              id="changeAliasModal-myAlias"
              className="grow"
              labelName={Language.$t.Input.MyAlias}
              placeholder={Language.$t.Input.MyAlias}
              value={myAlias}
              onChange={(e) => setMyAlias(e.target.value)}
            />
            <TextareaHapp
              id="changeAliasModal-message"
              labelName={Language.$t.Input.ChangeAliasMessage}
              rows={3}
              value={requestMessage}
              onChange={(e) => setRequestMessage(e.target.value)}
              border={true}
            />
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

export default memo(observer(_ChangeAliasModal));
