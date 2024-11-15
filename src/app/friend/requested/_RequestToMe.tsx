'use client';
import { memo, useState } from 'react';
import cls from 'classnames';
import { Dialog, Language, Loading } from '@/mobx/index';
import { Notif } from '@/types/Notif';
import { User } from '@/types/User';
import api from '@/utils/api.util';
import { observer } from 'mobx-react-lite';
import UserProrile from '@/components/molecules/UserProrile';

interface RequestToMeProps {
  notif: Notif;
  mutate: () => void;
}

const RequestToMe: React.FC<RequestToMeProps> = ({ notif, mutate }) => {
  const [friendUser ] = useState<User>(notif.Sender);

  const acceptFriend = async () => {
    Loading.setIsLoading(true);

    try {
      await api.post('/friend/accept-request', {
        id: notif.id,
        senderId: notif.senderId,
        receiverId: notif.receiverId,
        myAlias: notif.property1,
        friendAlias: notif.property2,
      });
      Loading.setIsLoading(false);
      const dialogReulst = await Dialog.openDialog(
        Dialog.SUCCESS,
        Language.$t.Success.Accept,
      );
      if (dialogReulst) {
        mutate();
      }
    } catch (error) {
      Loading.setIsLoading(false);
      //TODO
    }
  };

  const denyFriend = async () => {
    Loading.setIsLoading(true);

    try {
      await api.post('/notif/deny-request', { notifId: notif.id });
      Loading.setIsLoading(false);
      const dialogReulst = await Dialog.openDialog(
        Dialog.SUCCESS,
        Language.$t.Success.Deny,
      );
      if (dialogReulst) {
        mutate();
      }
    } catch (error) {
      Loading.setIsLoading(false);
      //TODO
    }
  };

  return (
    <div
      className={cls(
        'm-2 bg-white border border-gray-400 border-dashed rounded-md shadow-sm',
        'hover:shadow-lg hover:font-bold hover:border-2',
      )}
      id={notif.id}
    >
      <p className="text-md p-3">
        {Language.$t.Variable.AcceptFriend.replace(
          '{value}',
          friendUser.nickname,
        )}
      </p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 ml-3">
          <UserProrile
            user={friendUser}
            alt={friendUser.id}
            size={110}
            className="rounded-full object-cover aspect-square p-2"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 break-all">
                {Language.$t.Input.MyAlias}
              </p>
              <p className="text-md bg-gray-100 rounded p-1 px-2">
                {notif.property2}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <p className="text-xs text-gray-500 break-all">
                {Language.$t.Input.FriendAlias}
              </p>
              <p className="text-md bg-gray-100 rounded p-1 px-2">
                {notif.property1}
              </p>
            </div>
          </div>
        </div>
        {notif.property3 && (
          <div className="">
            <p className="text-xs text-gray-500 break-all">
              {Language.$t.Input.RequestMessage}
            </p>
            <p className="text-lg bg-gray-100 rounded p-1 px-2">
              {notif.property3}
            </p>
          </div>
        )}

        {/* 버튼 */}
        <div className="mr-3">
          <button
            className="m-1 border rounded-lg px-3 border-primary text-primary font-extralight text-lg hover:border-none hover:bg-danger hover:text-white"
            onClick={denyFriend}
          >
            {Language.$t.Button.Deny}
          </button>
          <button
            className="m-1 border rounded-lg px-3 border-primary text-primary font-extralight text-lg hover:border-none hover:bg-success hover:text-white"
            onClick={acceptFriend}
          >
            {Language.$t.Button.Accept}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(observer(RequestToMe));
