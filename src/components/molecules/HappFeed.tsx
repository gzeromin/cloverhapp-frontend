import { Happ } from '@/types/Happ';
import { useState } from 'react';
import cls from 'classnames';
import dateUtil from '@/utils/date.util';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useAuthState } from '@/context/auth';
import api from '@/utils/api.util';
import { FaEdit, FaRegTrashAlt } from 'react-icons/fa';
import { observer } from 'mobx-react-lite';
import { Dialog, Language, Loading } from '@/mobx';
import HappSaveModal from './HappSaveModal';
import HappDisplayModal from './HappDisplayModal';
import Image from 'next/image';

interface Props {
  happ: Happ;
  setSelectedCtrlHappId: (happId: string) => void;
  selectedCtrlHappId: string;
  mutateHapp: () => void;
}

const HappFeed: React.FC<Props> = ({
  happ,
  setSelectedCtrlHappId,
  selectedCtrlHappId,
  mutateHapp,
}) => {
  const { user } = useAuthState();
  const [showHappSaveModal, setShowHappSaveModal] = useState<boolean>(false);
  const [showDisplayModal, setShowDisplayModal] = useState<boolean>(false);

  const showCtrlModal = (newHappId: string) => {
    if (selectedCtrlHappId === newHappId) {
      setSelectedCtrlHappId('');
    } else {
      setSelectedCtrlHappId(newHappId);
    }
  };

  // const onSaveHapp = () => {
  //   mutateHapp();
  // };

  const deleteHapp = () => {
    Loading.setIsLoading(true);
    api
      .delete('/happ/' + happ.id)
      .then(() => {
        Dialog.openDialog(Dialog.SUCCESS, Language.$t.Success.HappDelete);
        mutateHapp();
      })
      .catch(() => {
        // TODO
        // handleError({ message: Language.$t.Fail.HappDelete });
      })
      .finally(() => {
        Loading.setIsLoading(false);
      });
  };

  return (
    <div id={happ.id} className={cls('w-5/6')}>
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
            src={`https://elasticbeanstalk-us-east-1-149536466661.s3.amazonaws.com/cloverhapp/${happ.id}.png`}
            alt={`happ feed ${happ.id}`}
            className="h-auto object-contain aspect-square lg:w-1/2"
            width={70}
            height={70}
            priority
          />
          <p className={cls('break-all grow',
            'underline decoration-green-400 decoration-dotted decoration-3 underline-offset-4'
          )}>
            {happ.memo}
          </p>
          {/* 편집 버튼 */}
          <div className="">
            {user && user.id === happ.User.id ? (
              <BsThreeDotsVertical
                className="z-40 text-gray-600 hover:bg-gray-100 rounded-full mt-2 text-2xl p-1 cursor-pointer"
                onClick={() => showCtrlModal(happ.id)}
              />
            ) : (
              <BsThreeDotsVertical className="z-40 text-white rounded-full mt-2 text-2xl p-1" />
            )}
            {happ.id === selectedCtrlHappId && (
              <div className="">
                <div
                  className="fixed z-30 inset-0 w-full h-full"
                  onClick={() => setSelectedCtrlHappId('')}
                >
                  {/* Background opacity */}
                </div>
                <div className="z-50 relative">
                  <div className="absolute -translate-y-5 translate-x-6 transform w-3 h-3 bg-white border border-gray-300 border-t-0 border-l-0 border-r-0 rotate-45"></div>
                  <ul className="absolute bg-white shadow-lg rounded -translate-y-7 translate-x-7">
                    <li
                      className="flex items-center gap-1 text-gray-600 m-1 px-2 break-keep rounded cursor-pointer hover:bg-gray-100 hover:font-semi-bold"
                      onClick={() => setShowHappSaveModal(true)}
                    >
                      <FaEdit />
                      {Language.$t.Button.Edit}
                    </li>
                    <hr />
                    <li
                      className="flex items-center gap-1 text-gray-600 m-1 px-2 break-keep rounded cursor-pointer hover:bg-gray-100 hover:font-semi-bold"
                      onClick={deleteHapp}
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
          {dateUtil.getFormatHour(new Date(happ.createdAt))}
        </span>
      </div>

      {/* Happ Save Modal */}
      {showHappSaveModal && (
        <HappSaveModal
          happName={happ.id}
          closeModal={() => setShowHappSaveModal(false)}
        />
      )}

      {/* Happ Display Modal */}
      {showDisplayModal && (
        <HappDisplayModal
          happId={happ.id}
          closeModal={() => setShowDisplayModal(false)}
        />
      )}
    </div>
  );
};

export default observer(HappFeed);
