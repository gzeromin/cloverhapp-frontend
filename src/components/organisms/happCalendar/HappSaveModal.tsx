'use client';
import api from '@/utils/api.util';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Language, Loading } from '@/mobx/index';
import { observer } from 'mobx-react-lite';
import cls from 'classnames';
import { Friend } from '@/types/Friend';
import { Tag } from '@/types/Tag';
import { useAuthState } from '@/context/auth';
import { UserStamp } from '@/types/UserStamp';
import { handleError } from '@/utils/error.util';
import { FaEraser, FaExclamation } from 'react-icons/fa';
import { AiFillCloseSquare } from 'react-icons/ai';
import InputNav, { OPEN_MONEY } from '@/components/molecules/happSaveModal/InputNav';
import { Happ, MoneyUnit, TodoStatus } from '@/types/Happ';
import InputArea from '@/components/molecules/happSaveModal/InputArea';
import { StampStatus, StampType } from '@/types/Stamp';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Book } from '@/types/Book';
import { HappActionEnum, useHappDispatch } from '@/context/happ';

interface HappSaveModalProps {
  userStampId?: string;
  closeModal: () => void;
  happId?: string;
}

const HappSaveModal: React.FC<HappSaveModalProps> = ({
  userStampId,
  closeModal,
  happId,
}) => {
  const [userStamp, setUserStamp] = useState<UserStamp>();
  const [stampStatus, setStampStatus] = useState(StampStatus.PRIVATE);
  const [openTime, setOpenTime] = useState(false);
  const [openWater, setOpenWater] = useState(false);
  const [openBook, setOpenBook] = useState(false);
  const [openMoney, setOpenMoney] = useState(false);
  const [openMemo, setOpenMemo] = useState(false);
  const [openUploadPhoto, setOpenUploadPhoto] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[] | null>(null);
  const [openFriends, setOpenFriends] = useState(false);
  const [openTags, setOpenTags] = useState(false);
  const [openTodo, setOpenTodo] = useState(false);
  const [openCopy, setOpenCopy] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>();
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [endTime, setEndTime] = useState<Date>();
  const [water, setWater] = useState('0');
  const [book, setBook] = useState<Book | null>(null);
  const [bookPercent, setBookPercent] = useState<string>('0');
  const [money, setMoney] = useState('0');
  const [moneyUnit, setMoneyUnit] = useState<MoneyUnit>(MoneyUnit.Won);
  const [memo, setMemo] = useState('');
  const [todo, setTodo] = useState<TodoStatus>(TodoStatus.TODO);
  const [copy, setCopy] = useState<Date[]>([new Date()]);
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  
  const { user } = useAuthState();
  const dispatch = useHappDispatch();

  useEffect(() => {
    if (userStampId) {
      // CREATE
      api.get('/user-stamp/' + userStampId).then((res) => {
        const UserStamp: UserStamp = res.data;
        setUserStamp(UserStamp);
        const stampType = UserStamp.Stamp.type;
        setOpenMoney(OPEN_MONEY.includes(stampType));
        setOpenWater(stampType === StampType.WATER);
        if (stampType === StampType.BOOK) {
          setOpenBook(true);
          setBook(UserStamp.Book);
          setBookPercent(UserStamp.bookPercent);
        }
        setStampStatus(UserStamp.status);
      }).catch((error) => { handleError(error); });
    }
  }, [userStampId]);
  useEffect(() => {
    if (happId) {
      // UPDATE
      api.get('/happ/' + happId).then((res) => {
        const happ: Happ = res.data;
        const UserStamp: UserStamp = happ.UserStamp;
        setUserStamp(UserStamp);
        if (happ.status) {
          setStampStatus(happ.status);
        }
        if (happ.imageUrls && happ.imageUrls.length !== 0) {
          setImageUrls(happ.imageUrls);
          setOpenUploadPhoto(true);
        }
        setStartTime(new Date(happ.startTime));
        setEndTime(new Date(happ.endTime));
        if (happ.endTime && happ.startTime !== happ.endTime) {
          setOpenTime(true);
        }
        if (UserStamp.Stamp.type === StampType.WATER && happ.water) {
          setWater(happ.water);
          setOpenWater(true);
        }
        if (OPEN_MONEY.includes(UserStamp.Stamp.type) && happ.money) {
          setMoney(happ.money);
          setOpenMoney(true);
        }
        setMoneyUnit(happ.moneyUnit);
        if (happ.memo) {
          setMemo(happ.memo);
          setOpenMemo(true);
        }
        if (happ.todo !== TodoStatus.NOT_TODO) {
          setTodo(happ.todo);
          setOpenTodo(true);
        }
        if (happ.Tags && happ.Tags.length !== 0) {
          setTagList(happ.Tags);
          setOpenTags(true);
        }
        if (happ.Friends && happ.Friends.length !== 0) {
          setFriendList(happ.Friends);
          setOpenFriends(true);
        }
        if (UserStamp.Stamp.type === StampType.BOOK) {
          setOpenBook(true);
          setBook(happ.Book);
          setBookPercent(happ.bookPercent);
        }
      }).catch((error) => { handleError(error); });
    }
  }, [happId]);

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
          water,
          status: stampStatus,
          todo: openTodo ? todo : TodoStatus.NOT_TODO,
          copy: openCopy ? copy : undefined,
          Friends: friendList,
          Tags: tagList,
          Book: book,
          bookPercent,
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
        // HappCalendar
        dispatch(HappActionEnum.UPDATE_HAPPLIST, res.data);
      }
      closeModal();
    } catch (error: any) {
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  const updateHapp = async () => {
    Loading.setIsLoading(true);
    try {
      const updateHappDto = {
        id: happId,
        UserStamp: userStamp,
        startTime,
        endTime,
        memo,
        imageUrls,
        money,
        moneyUnit,
        water,
        status: stampStatus,
        todo: openTodo ? todo : TodoStatus.NOT_TODO,
        copy: openCopy ? copy : undefined,
        Friends: friendList,
        Tags: tagList,
        Book: book,
        bookPercent,
      };
      const formData = new FormData();
      if (uploadedImages != null) {
        uploadedImages.forEach((file) => {
          formData.append('happ-images', file);
        });
      }
      formData.append('happ-data', JSON.stringify(updateHappDto));
      const res = await api.patch('/happ', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(HappActionEnum.UPDATE_HAPP, res.data);
      closeModal();
    } catch (error: any) {
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  const deleteHapp = async () => {
    Loading.setIsLoading(true);
    try {
      api.delete('/happ/' + happId);
      dispatch(HappActionEnum.DELETE_HAPP, happId);
      closeModal();
    } catch (error: any) {
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
            {!happId && 
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
            }
            {happId && 
              <div className={cls('flex items-center w-full gap-2')}>
                <button
                  className={cls(
                    'w-1/2 rounded-lg border-blue-700',
                    'border-2 border-dashed', 
                    'hover:bg-blue-700 hover:text-white py-1.5 px-3',
                    'text-blue-700 font-normal text-lg',
                    'flex items-center justify-center'
                  )}
                  onClick={deleteHapp}
                > 
                  {Language.$t.Button.Delete} <RiDeleteBinLine />
                </button>
                <button
                  className={cls(
                    'w-1/2 rounded-lg border-green-700',
                    'border-2 border-dashed', 
                    'hover:bg-green-700 hover:text-white py-1.5 px-3',
                    'text-green-700 font-normal text-lg',
                    'flex items-center justify-center'
                  )}
                  onClick={updateHapp}
                > 
                  {Language.$t.Button.Edit} <FaEraser />
                </button>
              </div>
            }
          </div>
        </div>
        {/* body */}
        <div className="pt-0 p-2">
          {/* Mini Navigation */}
          <InputNav
            stampStatus={stampStatus}
            setStampStatus={setStampStatus}
            type={userStamp?.Stamp.type}
            openTime={openTime}
            setOpenTime={setOpenTime}
            openWater={openWater}
            setOpenWater={setOpenWater}
            openBook={openBook}
            setOpenBook={setOpenBook}
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
            openBook={openBook}
            book={book}
            setBook={setBook}
            bookPercent={bookPercent}
            setBookPercent={setBookPercent}
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
