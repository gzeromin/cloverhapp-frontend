'use client';
import cls from 'classnames';
import {
  Dispatch,
  SetStateAction,
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Dialog, Language } from '@/mobx/index';
import { RiCloseLine } from 'react-icons/ri';
import { Tag } from '@/types/Tag';
import TagHapp from './TagHapp';
import { GoTag } from 'react-icons/go';

interface AddTagsHappProps{
  className?: string;
  tags: Tag[];
  setTags: Dispatch<SetStateAction<Tag[]>>;
  id?: string;
}

const AddTagsHapp: React.FC<AddTagsHappProps> = ({
  className,
  tags,
  setTags,
  id,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [showTags, setShowTags] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const tagContainerRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const index = tags.length - 1;
    if (tagContainerRef.current && index > -1) {
      const id = `${index}-${tags[index].name}`;
      const newTagElement = document.getElementById(id);
      newTagElement?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [tags]);
  
  const addTag = async () => {
    let error;
    // 태그는 최대 10개까지 등록 가능
    if (tags.length > 9) {
      error = Language.$t.Variable.MaxItemAdd.replace('{value}', 10);
    }
    // 중복된 태그인지 체크
    if (tags.some((f) => f.name === searchTerm)) {
      error = Language.$t.Variable.DuplicatedTag.replace('{value}', searchTerm);
    }
    // 30자 이하인지 체크
    if (searchTerm.length > 30) {
      error = Language.$t.FormError.OverMaxLength
        .replace('{value}', 30).replace('{field}', 'Tag');
    }

    // 에러 메세지 출력
    if (error) {
      const result = await Dialog.openDialog(
        Dialog.WARNING,
        error
      );
      if (result) {
        if (inputRef.current) {
          inputRef.current.focus();
        }
        return;
      }
    }

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
      addTag();      // 태그 추가
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
      <div 
        ref={tagContainerRef}
        className={cls(
          'flex flex-wrap gap-1 justify-start',
          'max-h-[90px] overflow-y-auto'
        )}
        id="tagContainer"
      >
        {tags?.map((tag, index) => (
          <div
            key={`tagList ${index}-${tag.name}`}
            className={cls(
              'px-1 flex items-center justify-between', 
              'rounded-full break-all group',
              'hover:bg-green-100 cursor-pointer'
            )}
            onClick={() => deleteTag(tag)}
            id={`tag-${index}`}
          >
            <TagHapp
              name={tag.name} 
            />
            <RiCloseLine className={cls(
              'text-sm text-gray-600',
              'group-hover:text-green-700 group-hover:font-extrabold'
            )} />
          </div>
        ))}
      </div>
      <div className="flex items-center justify-end gap-1">
        <GoTag className={cls(
          'text-gray-500 text-xl',
          { 'text-green-700': showTags }
        )} />
        <input
          type="text"
          ref={inputRef}
          placeholder={Language.$t.Placeholder.AddTag}
          className="w-[150px] focus:outline-none rounded text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.currentTarget.value)}
          onFocus={() => setShowTags(true)}
          onBlur={() => setTimeout(() => setShowTags(false), 100)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}   // IME 입력 시작
          onCompositionEnd={handleCompositionEnd}           // IME 입력 완료 시 호출
          id={id}
        />
      </div>
    </div>
  );
};

export default memo(observer(AddTagsHapp));
