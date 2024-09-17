'use client';
import cls from 'classnames';
import {
  Dispatch,
  InputHTMLAttributes,
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

interface AddTagsHappProps extends InputHTMLAttributes<HTMLInputElement> {
  className: string;
  tagList: Tag[];
  setTagList: Dispatch<SetStateAction<Tag[]>>;
}

const AddTagsHapp: React.FC<AddTagsHappProps> = ({
  className,
  tagList,
  setTagList,
}) => {
  const [observedIcon, setObservedIcon] = useState('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showTags, setShowTags] = useState(false);

  const getKey = (pageIndex: number, previousPageData: Tag[]) => {
    if (previousPageData && !previousPageData.length) return null;
    return `/tag?page=${pageIndex}&&term=${searchTerm}`;
  };

  const {
    data,
    size: page,
    setSize: setPage,
  } = useSWRInfinite<Tag[]>(getKey, fetcher);

  const tags: Tag[] = data
    ? ([] as Tag[])
      .concat(...data)
      .filter((d) => !tagList.some((f) => f.name === d.name))
    : [];

  useEffect(() => {
    if (!tags || tags.length === 0) return;
    const id = tags[tags.length - 1].id;
    if (id !== observedIcon) {
      setObservedIcon(id);
      observeElement(document.getElementById(id));
    }
  }, [tags]);

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
    setTagList((prev: Tag[]) => {
      return [...prev, tag];
    });
    setSearchTerm('');
  };

  const addTagDirect = () => {
    const newTag = { name: searchTerm } as Tag;
    setTagList((prev: Tag[]) => {
      return [...prev, newTag];
    });
    setSearchTerm('');
  };

  const deleteTag = (tag: Tag) => {
    setTagList((prev: Tag[]) => {
      return prev.filter((e) => e.id !== tag.id);
    });
  };
  return (
    <div
      className={`relative flex items-end justify-between py-1 ${className}`}
    >
      <div className={cls('grow grid grid-cols-3 gap-1')}>
        {tagList?.map((tag, index) => (
          <div
            key={`tagList ${tag.id} ${index}`}
            className="flex px-1 rounded-full bg-gray-100 items-center justify-between break-all group hover:bg-primary-hover hover:cursor-pointer"
            onClick={() => deleteTag(tag)}
          >
            <span className="text-sm mr-1">{tag.name}</span>
            <RiCloseLine className="text-sm mr-1 group-hover:text-primary group-hover:font-extrabold" />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1">
        <RiHashtag className="text-gray-500 text-xl" />
        <input
          type="text"
          placeholder={Language.$t.Placeholder.AddTag}
          className="w-[150px] focus:outline-none rounded text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          onFocus={() => setShowTags(true)}
          onBlur={() => setTimeout(() => setShowTags(false), 100)}
        />
      </div>
      {showTags && (
        <div
          className={cls(
            'absolute right-0 bottom-0 translate-x-2 -translate-y-7 bg-white border border-light-gray border-collapse w-[170px] max-h-[150px] break-all overflow-y-auto rounded shadow-md',
          )}
        >
          {searchTerm && tagList.every((e) => e.name !== searchTerm) && (
            <div
              className="flex items-center justify-between hover:bg-gray-200 cursor-pointer hover:bg-primary-hover hover:font-bold gap-1 p-1"
              onMouseDown={(e) => {
                e.preventDefault(); // Prevent the blur event
                addTagDirect();
              }}
            >
              {searchTerm}
              <BsArrowReturnLeft />
            </div>
          )}
          {tags?.map((tag, index) => (
            <div
              key={`tags ${tag.id} ${index}`}
              id={tag.id}
              className="flex items-center hover:bg-gray-200 cursor-pointer hover:bg-primary-hover hover:font-bold gap-1 p-1 min-h-[35px]"
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
