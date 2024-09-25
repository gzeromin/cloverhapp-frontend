'use client';
import api from '@/utils/api.util';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Language, Loading } from '@/mobx/index';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { Friend } from '@/types/Friend';
import { Tag } from '@/types/Tag';
import { AuthActionEnum, useAuthDispatch, useAuthState } from '@/context/auth';
import { UserStamp } from '@/types/UserStamp';
import { handleError } from '@/utils/error.util';
import { FaExclamation } from 'react-icons/fa';
import { AiFillCloseSquare } from 'react-icons/ai';
import InputNav, { OPEN_MONEY } from '@/components/molecules/happSaveModal/InputNav';
import { MoneyUnit, TodoStatus } from '@/types/Happ';
import InputArea from '@/components/molecules/happSaveModal/InputArea';
import { StampType } from '@/types/Stamp';

interface HappSaveModalProps {
  userStamp: UserStamp | undefined;
  closeModal: () => void;
  mutateHapp?: () => void;
}

const HappSaveModal: React.FC<HappSaveModalProps> = ({
  userStamp,
  closeModal,
  mutateHapp,
}) => {
  const [openTime, setOpenTime] = useState(false);
  const [openWater, setOpenWater] = useState(false);
  const [openMoney, setOpenMoney] = useState(false);
  const [openMemo, setOpenMemo] = useState(false);
  const [openUploadPhoto, setOpenUploadPhoto] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[] | null>(null);
  const [openFriends, setOpenFriends] = useState(false);
  const [openTags, setOpenTags] = useState(false);
  const [openTodo, setOpenTodo] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>();
  const [startTime, setStartTime] = useState<Date>();
  const [endTime, setEndTime] = useState<Date>();
  const [water, setWater] = useState('10');
  const [money, setMoney] = useState('0');
  const [moneyUnit, setMoneyUnit] = useState<MoneyUnit>(MoneyUnit.Won);
  const [memo, setMemo] = useState('');
  const [todo, setTodo] = useState<TodoStatus>(TodoStatus.TODO);
  const [copy, setCopy] = useState<Date[]>([]);
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const { user } = useAuthState();
  const dispatch = useAuthDispatch();

  useEffect(() => {
    const stampType = userStamp?.Stamp.type;
    if (stampType) {
      setOpenMoney(OPEN_MONEY.includes(stampType));
      setOpenWater(stampType === StampType.WATER);
    }
  }, [userStamp]);

  const createHapp = async () => {
    Loading.setIsLoading(true);
    try {
      if (user) {
        const createHappDto = {
          userId: user.id,
          UserStamp: userStamp,
          startTime,
          endTime,
          memo,
          money,
          moneyUnit,
          todo: openTodo ? todo : TodoStatus.NOT_TODO,
          copy: openCopy ? copy : undefined,
        };
        const formData = new FormData();
        if (uploadedImages != null) {
          uploadedImages.forEach((file) => {
            formData.append('happ-images', file);
          });
        }
        formData.append('happ-data', JSON.stringify(createHappDto));
        const res = await api.post('/happ', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        if (mutateHapp) {
          // DayLog
          mutateHapp();
        } else {
          // HappCalendar
          dispatch(AuthActionEnum.UPDATE_HAPPLIST, res.data);
        }
      }
      closeModal();
    } catch (error: any) {
      console.log(error);
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="z-50 fixed inset-0 w-full h-full flex flex-col items-center justify-center">
      <div
        className="fixed inset-0 w-full h-full bg-black opacity-50"
      >
        {/* Background opacity */}
      </div>
      <div className="z-50 box-border shadow-lg lg:min-w-[400px] bg-white border border-light-black rounded-lg text-2xl">
        {/* header */}
        <div className="relative flex gap-2 items-stretch p-3 pb-0 flex-row">
          <AiFillCloseSquare
            className={cls(
              'text-primary cursor-pointer text-3xl', 
              'mr-2 hover:text-primary-hover',
              'absolute right-0'
            )}
            onClick={closeModal}
          />
          {userStamp &&
            <Image
              src={userStamp.Stamp.url}
              alt={`happ modify modal ${userStamp.alias}`}
              className="h-auto object-contain aspect-square lg:w-1/2"
              width={90}
              height={90}
            />
          }
          <div
            className={cls('w-full flex flex-col justify-around items-center')}
          >
            <p className={cls(
              Language.logoFont,
              'text-4xl'
            )}>
              {userStamp?.alias}
            </p>
            <button
              className={cls(
                'w-full rounded-lg border-primary',
                'border-2 border-dashed', 
                'hover:bg-primary hover:text-white py-1.5 px-3',
                'text-primary font-normal text-lg',
                'flex items-center justify-center'
              )}
              onClick={createHapp}
            >
              {Language.$t.Button.Stamping} <FaExclamation />
            </button>
          </div>
        </div>
        {/* body */}
        <div className="pt-0 p-2">
          {/* Mini Navigation */}
          <InputNav
            type={userStamp?.Stamp.type}
            openTime={openTime}
            setOpenTime={setOpenTime}
            openWater={openWater}
            setOpenWater={setOpenWater}
            openMoney={openMoney}
            setOpenMoney={setOpenMoney}
            openMemo={openMemo}
            setOpenMemo={setOpenMemo}
            openUploadPhoto={openUploadPhoto}
            setOpenUploadPhoto={setOpenUploadPhoto}
            existPhoto={(imageUrls && imageUrls.length > 0)}
            openFriends={openFriends}
            setOpenFriends={setOpenFriends}
            openTags={openTags}
            setOpenTags={setOpenTags}
            openTodo={openTodo}
            setOpenTodo={setOpenTodo}
            openCopy={openCopy}
            setOpenCopy={setOpenCopy}
          />
          <InputArea
            type={userStamp?.Stamp.type}
            openTime={openTime}
            startTime={startTime}
            setStartTime={setStartTime}
            endTime={endTime}
            setEndTime={setEndTime}
            openWater={openWater}
            water={water}
            setWater={setWater}
            openMoney={openMoney}
            money={money}
            setMoney={setMoney}
            moneyUnit={moneyUnit}
            setMoneyUnit={setMoneyUnit}
            openMemo={openMemo}
            memo={memo}
            setMemo={setMemo}
            openUploadPhoto={openUploadPhoto}
            uploadedImages={uploadedImages}
            setUploadedImages={setUploadedImages}
            imageUrls={imageUrls}
            setImageUrls={setImageUrls}
            openFriends={openFriends}
            friendList={friendList}
            setFriendList={setFriendList}
            openTags={openTags}
            tagList={tagList}
            setTagList={setTagList}
            openTodo={openTodo}
            todo={todo}
            setTodo={setTodo}
            openCopy={openCopy}
            copy={copy}
            setCopy={setCopy}
          />
        </div>
      </div>
    </div>
  );
};

export default observer(HappSaveModal);
