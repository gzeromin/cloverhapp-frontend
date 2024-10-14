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
import { fetcher } from '@/utils/api.util';
import { RiCloseLine, RiHashtag } from 'react-icons/ri';
import { Tag } from '@/types/Tag';
import { BsArrowReturnLeft } from 'react-icons/bs';

interface AddTagsHappProps{
  className?: string;
  tags: Tag[];
  setTags: Dispatch<SetStateAction<Tag[]>>;
}

const AddTagsHapp: React.FC<AddTagsHappProps> = ({
  className,
  tags,
  setTags,
}) => {
  const [observedIcon, setObservedIcon] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showTags, setShowTags] = useState(false);
  const [isComposing, setIsComposing] = useState(false);

  const getKey = (pageIndex: number, previousPageData: Tag[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/tag?page=${pageIndex}&&term=${searchTerm}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
  } = useSWRInfinite<Tag[]>(getKey, fetcher);

  const tagList: Tag[] = data
    ? ([] as Tag[])
      .concat(...data)
      .filter((d) => !tags.some((f) => f.name === d.name))
    : [];

  useEffect(() => {
    if (!tagList || tagList.length === 0) return;
    const id = tagList[tagList.length - 1].id;
    if (id !== observedIcon) {
      setObservedIcon(id);
      observeElement(document.getElementById(id));
    }
  }, [tagList]);

  const observeElement = (element: HTMLElement | null) => {
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting === true) {
          console.log('[addTags]마지막 포스트에 왔습니다.');
          setPage(page + 1);
          observer.unobserve(element);
        }
      },
      { threshold: 1 },
    );
    observer.observe(element);
  };

  const addTag = (tag: Tag) => {
    setTags((prev: Tag[]) => {
      return [...prev, tag];
    });
    setSearchTerm('');
  };

  const addTagDirect = () => {
    const newTag = { name: searchTerm } as Tag;
    setTags((prev: Tag[]) => {
      return [...prev, newTag];
    });
    setSearchTerm('');
  };

  const deleteTag = (tag: Tag) => {
    setTags((prev: Tag[]) => {
      return prev.filter((e) => e.name !== tag.name);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // IME 입력 중이 아니라면 Enter 키를 처리
    if (e.key === 'Enter' && !isComposing && searchTerm.trim()) {
      e.preventDefault(); // 폼 제출 등의 기본 동작 방지
      addTagDirect();      // 태그 추가
    }
  };

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLInputElement>) => {
    setIsComposing(false); // IME 입력 끝났다고 알림
    setSearchTerm(e.currentTarget.value); // 최종 입력 값을 searchTerm에 반영
  };
  

  return (
    <div
      className={`relative flex items-end justify-between py-1 ${className}`}
    >
      <div className={cls(
        'flex flex-wrap gap-1',
        'max-h-[90px] overflow-y-auto'
      )}>
        {tags?.map((tag, index) => (
          <div
            key={`tagList ${tag.id} ${index}`}
            className="flex px-1 rounded-full bg-gray-100 items-center justify-between break-all group hover:bg-green-100 cursor-pointer"
            onClick={() => deleteTag(tag)}
          >
            <span className="text-sm mr-1">{tag.name}</span>
            <RiCloseLine className="text-sm mr-1 group-hover:text-green-700 group-hover:font-extrabold" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1">
        <RiHashtag className={cls(
          'text-gray-500 text-xl',
          { 'text-green-700': showTags }
        )} />
        <input
          type="text"
          placeholder={Language.$t.Placeholder.AddTag}
          className="w-[150px] focus:outline-none rounded text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          onFocus={() => setShowTags(true)}
          onBlur={() => setTimeout(() => setShowTags(false), 100)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}   // IME 입력 시작
          onCompositionEnd={handleCompositionEnd}           // IME 입력 완료 시 호출
        />
      </div>
      {showTags && (
        <div
          className={cls(
            'absolute right-0 bottom-0 translate-x-2 -translate-y-7',
            'w-[170px] max-h-[150px] break-all overflow-y-auto rounded shadow-md',
            'bg-white border-collapse',
          )}
        >
          {searchTerm && tags.every((e) => e.name !== searchTerm) && (
            <div
              className={cls(
                'flex items-center justify-between gap-1 p-1',
                'hover:bg-green-50 cursor-pointer hover:font-bold'
              )}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent the blur event
                addTagDirect();
              }}
            >
              {searchTerm}
              <BsArrowReturnLeft />
            </div>
          )}
          {tagList?.map((tag, index) => (
            <div
              key={`tags ${tag.id} ${index}`}
              id={tag.id}
              className={cls(
                'flex items-center hover:bg-green-50 cursor-pointer',
                'hover:font-bold gap-1 p-1 min-h-[35px]'
              )}
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent the blur event
                addTag(tag);
              }}
            >
              <span className="text-xs">{tag.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(observer(AddTagsHapp));
