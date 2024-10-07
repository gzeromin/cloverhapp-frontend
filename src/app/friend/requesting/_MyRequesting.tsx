'use client';
import { memo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { Dialog, Language, Loading } from '@/mobx/index';
import { Notif } from '@/types/Notif';
import api from '@/utils/api.util';
import UserProrile from '@/components/molecules/UserProrile';

interface MyRequestingProps {
  notif: Notif;
  mutate: () => void;
}

const MyRequesting: React.FC<MyRequestingProps> = ({ notif, mutate }) => {
  const [friendUser ] = useState(notif.Receiver);

  const denyFriend = async () => {
    Loading.setIsLoading(true);

    try {
      await api.post('/notif/deny-request', { notifId: notif.id });
      const dialogReulst = await Dialog.openDialog(
        Dialog.SUCCESS,
        Language.$t.Success.RequestCancel,
      );
      if (dialogReulst) {
        mutate();
      }
    } catch (error) {
      //TODO
    } finally {
      Loading.setIsLoading(false);
    }
  };
  return (
    <div
      className={cls(
        'max-w-xl mx-auto',
        'm-2 flex justify-between items-center bg-white border border-gray-400',
        'border-dashed rounded-md shadow-sm hover:shadow-lg hover:font-bold hover:border-2',
      )}
      id={notif.id}
    >
      <div className="flex items-center gap-1 ml-3">
        <UserProrile
          user={friendUser}
          alt={friendUser.id}
          size={110}
          className="rounded-full object-contain aspect-square"
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 break-all">
              {Language.$t.Input.MyAlias}
            </p>
            <p className="text-md bg-gray-100 rounded p-1 px-2">
              {notif.property1}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500 break-all">
              {Language.$t.Input.FriendAlias}
            </p>
            <p className="text-md bg-gray-100 rounded p-1 px-2">
              {notif.property2}
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
      <button
        className="mr-3 border rounded-lg px-3 border-primary text-primary font-extralight text-lg hover:border-none hover:bg-danger hover:text-white"
        onClick={denyFriend}
      >
        {Language.$t.Button.RequestCancel}
      </button>
    </div>
  );
};

export default memo(observer(MyRequesting));
