'use client';
import cls from 'classnames';
import {
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx/index';
import useSWRInfinite from 'swr/infinite';
import { kakaoBookFetcher } from '@/utils/api.util';
import { BsArrowReturnLeft } from 'react-icons/bs';
import { Book } from '@/types/Book';
import Image from 'next/image';
import { IoIosSearch } from 'react-icons/io';

interface BookHappProps{
  className?: string;
  setBook: Dispatch<SetStateAction<Book | null>>;
}

const BookHapp: React.FC<BookHappProps> = ({
  className,
  setBook,
}) => {
  const [observedIcon, setObservedIcon] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showBooks, setShowBooks] = useState(false);

  const getKey = (pageIndex: number, previousPageData: Book[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/book?target=title&query=${encodeURIComponent(searchTerm)}&page=${pageIndex + 1}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
  } = useSWRInfinite<Book[]>(getKey, kakaoBookFetcher);

  const bookList: Book[] = data
    ? ([] as Book[])
      .concat(...data)
    : [];
  
  useEffect(() => {
    if (!bookList || bookList.length === 0) return;
    const id = bookList[bookList.length - 1].isbn;
    if (id !== observedIcon) {
      setObservedIcon(id);
      observeElement(document.getElementById(id));
    }
  }, [bookList]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('[book]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 },
    );
    observer.observe(element);
  };

  const addBook = (book: Book) => {
    setBook(book);
    setSearchTerm('');
  };

  const addBookDirect = () => {
    const newBook = { title: searchTerm } as Book;
    setBook(newBook);
    setSearchTerm('');
  };

  return (
    <div
      className={cls(
        'relative flex items-center justify-between gap-1',
        className
      )}
    >
      <div className="flex items-center justify-end gap-1">
        <IoIosSearch className={cls(
          'text-xl',
          { 'text-emerald-400': showBooks }
        )} />
        <input
          type="text"
          placeholder={Language.$t.Placeholder.AddBook}
          className="w-full focus:outline-none rounded text-sm border"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          onFocus={() => setShowBooks(true)}
          onBlur={() => setTimeout(() => setShowBooks(false), 100)}
        />
      </div>
      {showBooks && (
        <div
          className={cls(
            'absolute right-0 bottom-0 translate-x-2 -translate-y-7',
            'w-[170px] max-h-[150px] break-all overflow-y-auto rounded shadow-md',
            'bg-white border-collapse',
          )}
        >
          {bookList.length == 0 && searchTerm && (
            <div
              className={cls(
                'flex items-center justify-between gap-1 p-1',
                'hover:bg-green-50 cursor-pointer hover:font-bold'
              )}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent the blur event
                addBookDirect();
              }}
            >
              {searchTerm}
              <BsArrowReturnLeft />
            </div>
          )}
          {bookList?.map((book, index) => (
            <div
              key={`tags ${book.isbn} ${index}`}
              id={book.isbn}
              className={cls(
                'flex items-center hover:bg-green-50 cursor-pointer text-sm',
                'hover:font-bold gap-1 p-1 min-h-[35px]'
              )}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent the blur event
                addBook(book);
              }}
            >
              {book.thumbnail && (
                <Image
                  src={book.thumbnail}
                  alt={book.isbn}
                  className={cls('w-auto')}
                  width={10}
                  height={10}
                  priority
                />
              )}
              <span className="text-xs">{book.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(observer(BookHapp));
