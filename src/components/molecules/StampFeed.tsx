import { Stamp } from '@/types/Stamp';
import { useState } from 'react';
import cls from 'classnames';
import dateUtil from '@/utils/date.util';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useAuthState } from '@/context/auth';
import api from '@/utils/api.util';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';
import { Dialog, Language, Loading } from '@/mobx';
import StampSaveModal from './StampSaveModal';
import StampDisplayModal from './StampDisplayModal';
import Image from 'next/image';

interface Props {
  stamp: Stamp;
  setSelectedCtrlStampId: (stampId: string) => void;
  selectedCtrlStampId: string;
  mutateStamp: () => void;
}

const StampFeed: React.FC<Props> = ({
  stamp,
  setSelectedCtrlStampId,
  selectedCtrlStampId,
  mutateStamp,
}) => {
  const { user } = useAuthState();
  const [showStampSaveModal, setShowStampSaveModal] = useState<boolean>(false);
  const [showDisplayModal, setShowDisplayModal] = useState<boolean>(false);

  const showCtrlModal = (newStampId: string) => {
    if (selectedCtrlStampId === newStampId) {
      setSelectedCtrlStampId('');
    } else {
      setSelectedCtrlStampId(newStampId);
    }
  };

  // const onSaveStamp = () => {
  //   mutateStamp();
  // };

  const deleteStamp = () => {
    Loading.setIsLoading(true);
    api
      .delete('/stamp/' + stamp.id)
      .then(() => {
        Dialog.openDialog(Dialog.SUCCESS, Language.$t.Success.StampDelete);
        mutateStamp();
      })
      .catch(() => {
        // TODO
        // handleError({ message: Language.$t.Fail.StampDelete });
      })
      .finally(() => {
        Loading.setIsLoading(false);
      });
  };

  return (
    <div id={stamp.id} className={cls('w-5/6')}>
      <div
        className={cls('flex items-end px-2 py-1 m-2 gap-1')}
      >
        {/* Header */}
        <div className={cls(
          'flex items-center grow gap-4 p-3', 
          'rounded-full bg-white border-2 border-dashed border-gray-300',
        )}>
          {/* 스탬프 */}
          <Image
            src={`https://elasticbeanstalk-us-east-1-149536466661.s3.amazonaws.com/cloverhapp/${stamp.stampName}.png`}
            alt={`stamp feed ${stamp.id}`}
            className="h-auto object-contain aspect-square lg:w-1/2"
            width={70}
            height={70}
          />
          <p className={cls('break-all grow',
            'underline decoration-green-400 decoration-dotted decoration-3 underline-offset-4'
          )}>
            {stamp.memo}
          </p>
          {/* 편집 버튼 */}
          <div className="">
            {user && user.id === stamp.User.id ? (
              <BsThreeDotsVertical
                className="z-40 text-gray-600 hover:bg-gray-100 rounded-full mt-2 text-2xl p-1 cursor-pointer"
                onClick={() => showCtrlModal(stamp.id)}
              />
            ) : (
              <BsThreeDotsVertical className="z-40 text-white rounded-full mt-2 text-2xl p-1" />
            )}
            {stamp.id === selectedCtrlStampId && (
              <div className="">
                <div
                  className="fixed z-30 inset-0 w-full h-full"
                  onClick={() => setSelectedCtrlStampId('')}
                >
                  {/* Background opacity */}
                </div>
                <div className="z-50 relative">
                  <div className="absolute -translate-y-5 translate-x-6 transform w-3 h-3 bg-white border border-gray-300 border-t-0 border-l-0 border-r-0 rotate-45"></div>
                  <ul className="absolute bg-white shadow-lg rounded -translate-y-7 translate-x-7">
                    <li
                      className="flex items-center gap-1 text-gray-600 m-1 px-2 break-keep rounded cursor-pointer hover:bg-gray-100 hover:font-semi-bold"
                      onClick={() => setShowStampSaveModal(true)}
                    >
                      <FaEdit />
                      {Language.$t.Button.Edit}
                    </li>
                    <hr />
                    <li
                      className="flex items-center gap-1 text-gray-600 m-1 px-2 break-keep rounded cursor-pointer hover:bg-gray-100 hover:font-semi-bold"
                      onClick={deleteStamp}
                    >
                      <FaRegTrashAlt />
                      {Language.$t.Button.Delete}
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 시간 */}
        <span className="text-xs text-gray-500">
          {dateUtil.getFormatHour(new Date(stamp.createdAt))}
        </span>
      </div>

      {/* Stamp Save Modal */}
      {showStampSaveModal && (
        <StampSaveModal
          stampName={stamp.stampName}
          closeModal={() => setShowStampSaveModal(false)}
        />
      )}

      {/* Stamp Display Modal */}
      {showDisplayModal && (
        <StampDisplayModal
          stampId={stamp.id}
          closeModal={() => setShowDisplayModal(false)}
        />
      )}
    </div>
  );
};

export default observer(StampFeed);
