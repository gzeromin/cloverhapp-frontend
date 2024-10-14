'use client';
import { observer } from 'mobx-react-lite';
import { useParams } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import api from '@/utils/api.util';
import cls from 'classnames';
import { Language, Loading } from '@/mobx/index';
import { UserStamp } from '@/types/UserStamp';
import { StampStatus, StampType } from '@/types/Stamp';
import { Book } from '@/types/Book';
import { MoneyUnit, TodoStatus } from '@/types/Happ';
import { Friend } from '@/types/Friend';
import { Tag } from '@/types/Tag';
import { useAuthState } from '@/context/auth';
import { useRouter } from 'next/navigation';
import InputNav, { OPEN_MONEY } from '@/components/molecules/happSaveModal/InputNav';
import Image from 'next/image';
import { FaExclamation } from 'react-icons/fa';
import { handleError } from '@/utils/error.util';
import TextareaHapp from '@/components/atoms/TextareaHapp';
import InputArea from '@/components/molecules/happSaveModal/InputArea';


interface Props {}

const CreateHappPage: React.FC<Props> = () => {
  const { userStampId } = useParams();
  const [userStamp, setUserStamp] = useState<UserStamp>();
  const [stampStatus, setStampStatus] = useState(StampStatus.PRIVATE);
  const [openTime, setOpenTime] = useState(false);
  const [openWater, setOpenWater] = useState(false);
  const [openBook, setOpenBook] = useState(false);
  const [openMoney, setOpenMoney] = useState(false);
  const [openUploadPhoto, setOpenUploadPhoto] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<File[] | null>(null);
  const [openFriends, setOpenFriends] = useState(false);
  const [openTags, setOpenTags] = useState(false);
  const [openTodo, setOpenTodo] = useState(false);
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
  const [friendList, setFriendList] = useState<Friend[]>([]);
  const [tagList, setTagList] = useState<Tag[]>([]);
  const { user } = useAuthState();
  const router = useRouter();

  
  useEffect(() => {
    if (userStampId) {
      // Ensure userStampId is a string
      const resolvedUserStampId = Array.isArray(userStampId) ? userStampId[0] : userStampId;
      // GET User Stamp
      api.get('/user-stamp/' + resolvedUserStampId).then((res) => {
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
      }).catch((error) => { 
        handleError(error); 
      });
    }
  }, [userStampId]);

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
        await api.post('/happ', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        router.back();
      }
    } catch (error: any) {
      handleError(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className="h-screen overflow-y-auto flex flex-col py-20 px-10 gap-3">

      {/* Header */}
      <div className={cls('flex items-center justify-center gap-5')}>
        {userStamp &&
          <Image
            src={userStamp.Stamp.url}
            alt={`happ modify modal ${userStamp.alias}`}
            className="h-auto object-contain aspect-square lg:w-1/2"
            width={120}
            height={120}
            priority
          />
        }
        <p className={cls(
          Language.logoFont,
          'text-4xl'
        )}>
          {userStamp?.alias}
        </p>
      </div>

      {/* Body  */}
      <TextareaHapp
        className={'text-lg'}
        placeholder={Language.$t.Placeholder.Memo}
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        autoHeight={true}
        border={true}
        marginBottom=""
        textAreaClassName={cls('border-dashed border-2 border-gray-100 min-h-[50px]')}
      />

      {/* Buttons */}
      <div className={cls(
        'flex py-1 border-t border-light-gray gap-1',
      )}>
        <button
          className={cls(
            'flex-1 m-1 border-2 rounded-lg',
            'bg-cancel py-1.5 px-3 text-white font-normal text-2xl',
            'border-cancel hover:text-cancel hover:bg-gray-100'
          )}
          onClick={() => router.back()}
        >
          {Language.$t.Button.Cancel}
        </button>
        <button
          className={cls(
            'flex-1 m-1 border-2 rounded-lg',
            'bg-primary py-1.5 px-3 text-white font-normal text-2xl',
            'flex items-center justify-center',
            'border-primary hover:text-primary hover:bg-primary-100'
          )}
          onClick={createHapp}
        >
          {Language.$t.Button.Stamping} <FaExclamation />
        </button>
      </div>
      {/* Body */}
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
          openUploadPhoto={openUploadPhoto}
          setOpenUploadPhoto={setOpenUploadPhoto}
          existPhoto={(imageUrls && imageUrls.length > 0)}
          openFriends={openFriends}
          setOpenFriends={setOpenFriends}
          openTags={openTags}
          setOpenTags={setOpenTags}
          openTodo={openTodo}
          setOpenTodo={setOpenTodo}
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
        />
      </div>

      
    </div>
  );
};

export default memo(observer(CreateHappPage));
