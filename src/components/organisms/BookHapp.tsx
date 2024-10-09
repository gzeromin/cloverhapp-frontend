'use client';
import cls from 'classnames';
import {
  Dispatch,
  SetStateAction,
  memo,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx/index';
import { Book } from '@/types/Book';
import SearchBook from '../molecules/SearchBook';
import Image from 'next/image';
import { AiFillCloseSquare } from 'react-icons/ai';

interface BookHappProps{
  className?: string;
  book: Book | null;
  setBook: Dispatch<SetStateAction<Book | null>>;
  bookPercent: string;
  setBookPercent: Dispatch<SetStateAction<string>>;
}

const BookHapp: React.FC<BookHappProps> = ({
  className,
  book,
  setBook,
  bookPercent,
  setBookPercent,
}) => {
  return (
    <div
      className={cls(
        'flex flex-col py-1',
        className
      )}
    >
      <div
        className={cls(
          'flex items-center justify-between gap-1',
        )}
      >
        <div className={cls(
          'text-sm',{
            'bg-emerald-400 rounded-full' : bookPercent == '100',
          }, 
          Language.logoFont
        )}>
          {bookPercent} %
        </div>
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={bookPercent}
          onChange={(e) => setBookPercent(e.target.value)}
          className={cls(
            'grow focus:outline-none',
          )}
        />
        <SearchBook
          setBook={setBook}
        />
      </div>
      {book && (
        <div className={cls('relative flex items-start m-1 bg-gray-100 rounded-lg shadow-lg')}>
          <button
            onClick={() => setBook(null)}
            className="absolute top-0 right-0 p-2 rounded font-extrabold text-green-600"
          >
            <AiFillCloseSquare size={24} />
          </button>
          <div className={cls('flex items-start p-4')}>
            {book.thumbnail && (
              <div className={cls('w-24 h-24 mr-4')}>
                <Image
                  src={book.thumbnail}
                  alt={book.isbn}
                  className={cls('w-full h-full object-cover rounded-lg')}
                  width={96}
                  height={96}
                  priority
                />
              </div>
            )}
            <div className={cls('flex-1')}>
              <div className={cls('text-lg font-semibold text-gray-800 break-words')}>
                {book.title}
              </div>
              <p className={cls('text-sm text-gray-600')}>
                {book.publisher}
              </p>
              <p className={cls('text-sm text-gray-500')}>
                {book.authors && book.authors.join(', ')}
              </p>
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default memo(observer(BookHapp));
