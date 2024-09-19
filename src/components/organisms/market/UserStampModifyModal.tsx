'use client';
import { useEffect, useState } from 'react';
import { AiFillCloseSquare } from 'react-icons/ai';
import { Language, Loading } from '@/mobx/index';
import { observer } from 'mobx-react-lite';
import InputHapp from '@/components/atoms/InputHapp';
import TextareaHapp from '@/components/atoms/TextareaHapp';
import { UserStamp } from '@/types/UserStamp';
import Image from 'next/image';
import api from '@/utils/api.util';
import { handleError } from '@/utils/error.util';

interface UserStampModifyModalProps {
  userStamp: UserStamp | undefined;
  closeModal: () => void;
  mutateUserStamp: () => void;
}

const UserStampModifyModal: React.FC<UserStampModifyModalProps> = ({
  userStamp,
  closeModal,
  mutateUserStamp,
}) => {
  const [alias, setAlias] = useState<string | undefined>('');
  const [memo, setMemo] = useState('');

  // const dispatch = useAuthDispatch();
  useEffect(() => {
    if (userStamp) {
      setAlias(userStamp.alias);
      setMemo(userStamp.memo);
    }
  }, []);

  const updateUserStamp = async () => {
    Loading.setIsLoading(true);
    try {
      const updateStampDto = {
        alias,
        memo,
      };

      const res = await api.post('/user-stamp/' + userStamp!.id, updateStampDto);
      console.log(res);
      mutateUserStamp();

      closeModal();
    } catch (error: any) {
      console.log(error);
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  const deleteUserStamp = async () => {
    Loading.setIsLoading(true);
    try {
      await api.delete('/user-stamp/' + userStamp!.id);
      mutateUserStamp();
      closeModal();
    } catch (error: any) {
      handleError(error);
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
          <p className="pl-1">{Language.$t.Modal.MyStampSetting}</p>
          <div className="flex gap-3">
            <AiFillCloseSquare
              className="text-primary cursor-pointer"
              onClick={closeModal}
            />
          </div>
        </div>
        {/* body */}
        {userStamp && (
          <div className="p-4 flex gap-4">
            <div className="w-1/2 relative justify-stretch flex flex-col">
              <Image
                src={userStamp.Stamp.url}
                alt={userStamp.Stamp.id}
                className="m-auto p-6 object-contain aspect-square"
                width={200}
                height={200}
                priority
              />
            </div>
            <div className="">
              <InputHapp
                labelName={Language.$t.Input.Alias}
                className="font-semibold"
                placeholder={Language.$t.Input.Alias}
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                marginBottom="mb-3"
                border={true}
              />
              <TextareaHapp
                labelName={Language.$t.Input.Memo}
                className="text-base"
                placeholder={Language.$t.Placeholder.Memo}
                rows={3}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                marginBottom=""
                border={true}
              />
            </div>
          </div>
        )}
        {/* footer */}
        <div className="grid grid-flow-col items-center justify-stretch p-1 border-t border-light-gray">
          <button
            className="m-1 border rounded-lg bg-danger py-1.5 px-3 text-white font-extralight text-lg"
            onClick={deleteUserStamp}
          >
            {Language.$t.Button.Delete}
          </button>
          <button
            className="m-1 border rounded-lg bg-cancel py-1.5 px-3 text-white font-extralight text-lg"
            onClick={closeModal}
          >
            {Language.$t.Button.Cancel}
          </button>
          <button 
            className="m-1 border rounded-lg bg-primary py-1.5 px-3 text-white font-extralight text-lg"
            onClick={updateUserStamp}  
          >
            {Language.$t.Button.Save}
          </button>
        </div>
      </div>
    </div>
  );
};

export default observer(UserStampModifyModal);
