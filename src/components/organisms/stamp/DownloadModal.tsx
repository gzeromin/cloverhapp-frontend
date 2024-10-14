'use client';
import { AuthActionEnum, useAuthDispatch } from '@/context/auth';
import { Language } from '@/mobx/index';
import { Stamp } from '@/types/Stamp';
import { BUCKET_URL } from '@/utils/api.util';
import Image from 'next/image';
import { AiFillCloseSquare } from 'react-icons/ai';
import api from '@/utils/api.util';
import { useEffect, useState } from 'react';
import { User } from '@/types/User';
import cls from 'classnames';

interface DownloadModalProps {
  stamp: Stamp | undefined;
  closeModal: () => void;
}

const DownloadModal: React.FC<DownloadModalProps> = ({ stamp, closeModal }) => {
  const [register, setRegister] = useState<User>();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    if (stamp) {
      api
        .get(`/auth/${stamp.userId}`)
        .then((res) => {
          setRegister(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [stamp]);

  const downloadStamp = async () => {
    if (stamp && register) {
      const res = await api.post('/user-stamp', {
        stampId: stamp.id,
        stampStatus: stamp.status,
        registerId: register.id,
        droplet: stamp.droplet,
        name: stamp.name,
        description: stamp.description,
      });
      dispatch(AuthActionEnum.SET_DROPLET, res.data);
      closeModal();
    }
  };

  return (
    <div className={cls(
      'fixed z-50 inset-0 w-full h-full', 
      'flex flex-col items-center justify-center',
      Language.logoFont
    )}>
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-50"
        onClick={closeModal}
      >
        {/* Background opacity */}
      </div>
      <div className="z-50 box-border shadow-lg min-w-[300px] bg-white border border-light-black rounded-lg text-2xl">
        {/* header */}
        <div className="flex justify-between items-center border-b border-light-gray p-3">
          <p className="pl-1">{Language.$t.Modal.IconDownload}</p>
          <AiFillCloseSquare
            className="text-primary cursor-pointer"
            onClick={closeModal}
          />
        </div>
        {/* body */}
        {stamp && (
          <div className="p-4 flex gap-4">
            <div className="w-1/2">
              <Image
                src={stamp.url}
                alt={stamp.id}
                className="m-auto p-6 object-contain aspect-square"
                priority={false}
                width={250}
                height={250}
              />
            </div>
            <div className="p-2">
              <p className="text-5xl font-bold">{stamp.name}</p>
              <p className="py-3 text-base text-gray-400">
                {register && register.nickname}
              </p>
              <div className="flex justify-normal items-center">
                <Image
                  src={`${BUCKET_URL}/public/icons/droplet.png`}
                  alt="droplet"
                  className=""
                  width={25}
                  height={25}
                ></Image>
                <p className="">{stamp.droplet}</p>
              </div>
              <p className="pt-6">{stamp.description}</p>
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
            onClick={downloadStamp}
          >
            {Language.$t.Button.Download}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DownloadModal;
