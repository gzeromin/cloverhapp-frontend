'use client';
import { Dispatch, memo, SetStateAction } from 'react';
import TextareaHapp from '@/components/molecules/TextareaHapp';
import FileUploadHapp from '@/components/atoms/FileUploadHapp';
import AddFriendsHapp from '@/components/atoms/AddFriendsHapp';
import AddTagsHapp from '@/components/atoms/AddTagsHapp';
import MoneyHapp from '@/components/atoms/MoneyHapp';
import { Friend } from '@/types/Friend';
import { Tag } from '@/types/Tag';
import { MoneyUnit, TodoStatus } from '@/types/Happ';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';
import cls from 'classnames';
import WaterHapp from '@/components/atoms/WaterHapp';
import StartEndTimeInput from '@/components/organisms/StartEndTimeInput';
import { StampType } from '@/types/Stamp';
import { OPEN_TIME } from './InputNav';
import StartTimeInput from '@/components/organisms/StartTimeInput';
import TodoHapp from '@/components/atoms/TodoHapp';
import DateTimesInput from '@/components/organisms/DateTimesInput';
import BookHapp from '../../organisms/BookHapp';
import { Book } from '@/types/Book';

interface Props {
  type: StampType | undefined;
  openTime: boolean;
  startTime: Date;
  endTime: Date | undefined;
  setStartTime: Dispatch<SetStateAction<Date>>;
  setEndTime: Dispatch<SetStateAction<Date | undefined>>;
  openWater: boolean;
  water: string;
  setWater: Dispatch<SetStateAction<string>>;
  openBook: boolean;
  book: Book | null;
  setBook: Dispatch<SetStateAction<Book | null>>;
  bookPercent: string;
  setBookPercent: Dispatch<SetStateAction<string>>;
  openMoney: boolean;
  money: string;
  setMoney: Dispatch<SetStateAction<string>>;
  moneyUnit: MoneyUnit;
  setMoneyUnit: Dispatch<SetStateAction<MoneyUnit>>;
  openMemo?: boolean;
  memo?: string;
  setMemo?: Dispatch<SetStateAction<string>>;
  openUploadPhoto: boolean;
  uploadedImages: File[] | null;
  setUploadedImages: Dispatch<SetStateAction<File[] | null>>;
  imageUrls: string[] | undefined;
  setImageUrls: Dispatch<SetStateAction<string[] | undefined>>;
  openFriends: boolean;
  friendList: Friend[];
  setFriendList: Dispatch<SetStateAction<Friend[]>>;
  openTags: boolean;
  tagList: Tag[];
  setTagList: Dispatch<SetStateAction<Tag[]>>;
  openTodo?: boolean;
  todo?: TodoStatus;
  setTodo?: Dispatch<SetStateAction<TodoStatus>>;
  openCopy?: boolean;
  copy?: Date[];
  setCopy?: Dispatch<SetStateAction<Date[]>>;
}

const InputArea: React.FC<Props> = ({
  type,
  openTime,
  startTime,
  endTime,
  setStartTime,
  setEndTime,
  openWater,
  water,
  setWater,
  openBook,
  book,
  setBook,
  bookPercent,
  setBookPercent,
  openTodo,
  todo,
  setTodo,
  openMoney,
  money,
  setMoney,
  moneyUnit,
  setMoneyUnit,
  openMemo,
  memo,
  setMemo,
  openUploadPhoto,
  uploadedImages,
  setUploadedImages,
  imageUrls,
  setImageUrls,
  openFriends,
  friendList,
  setFriendList,
  openTags,
  tagList,
  setTagList,
  openCopy,
  copy,
  setCopy,
}) => {
  return (
    <div className="flex flex-col gap-1">
      { type && OPEN_TIME.includes(type) && (
        <StartEndTimeInput
          className={`${openTime ? 'block' : 'hidden'}`}
          startTime={startTime}
          endTime={endTime}
          setStartTime={setStartTime}
          setEndTime={setEndTime}
        />
      )}
      { type && !OPEN_TIME.includes(type) && (
        <StartTimeInput
          className={`${openTime ? 'block' : 'hidden'}`}
          startTime={startTime}
          setStartTime={setStartTime}
        />
      )}
      <WaterHapp
        className={`${openWater ? 'block' : 'hidden'}`}
        value={water}
        onChange={(e) => setWater(e.target.value)}
        inputClassName={cls('border-dashed border-2 border-gray-100')}
      />
      <BookHapp
        className={`${openBook ? 'block' : 'hidden'}`}
        book={book}
        setBook={setBook}
        bookPercent={bookPercent}
        setBookPercent={setBookPercent}
      />
      <MoneyHapp
        className={`${openMoney ? 'block' : 'hidden'}`}
        value={money}
        onChange={(e) => setMoney(e.target.value)}
        inputClassName={cls('border-dashed border-2 border-gray-100')}
        marginBottom='mb-0'
        moneyUnit={moneyUnit}
        setMoneyUnit={setMoneyUnit}
      />
      {setMemo && (
        <TextareaHapp
          id="inputArea-memo"
          className={`${openMemo ? 'block' : 'hidden'} text-lg`}
          placeholder={Language.$t.Placeholder.Memo}
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          autoHeight={true}
          border={true}
          textAreaClassName='border-dashed border-2 border-gray-100 min-h-[50px]'
        />
      )}
      <FileUploadHapp
        className={`${openUploadPhoto ? 'block' : 'hidden'} border-gray-100`}
        uploadedImages={uploadedImages}
        setUploadedImages={setUploadedImages}
        width={0}
        height={0}
        textColor="text-gray-400"
        textSize="text-base"
        imageUrls={imageUrls}
        onDeleteImageUrls={() => setImageUrls([])}
      />
      <AddFriendsHapp
        className={`${openFriends ? 'block' : 'hidden'}`}
        friends={friendList}
        setFriends={setFriendList}
      />
      <AddTagsHapp
        className={`${openTags ? 'block' : 'hidden'}`}
        tags={tagList}
        setTags={setTagList}
      />
      {setTodo && (
        <TodoHapp
          className={`${openTodo ? 'block' : 'hidden'} border-gray-100`}
          todo={todo}
          setTodo={setTodo}
        />
      )}
      {setCopy && (
        <DateTimesInput 
          className={`${openCopy ? 'block' : 'hidden'} border-gray-100`}
          times={copy}
          setTimes={setCopy}
        />
      )}
    </div>
  );
};

export default memo(observer(InputArea));