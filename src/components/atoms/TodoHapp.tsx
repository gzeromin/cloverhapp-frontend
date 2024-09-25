'use client';
import cls from 'classnames';
import { Dispatch, memo, SetStateAction } from 'react';
import { observer } from 'mobx-react-lite';
import { TodoStatus } from '@/types/Happ';
import { BsCheckCircleFill, BsCircle } from 'react-icons/bs';
import { Language } from '@/mobx';

interface TodoHappProps {
  className: string;
  todo: TodoStatus | undefined;
  setTodo: Dispatch<SetStateAction<TodoStatus>>;
}

const TodoHapp: React.FC<TodoHappProps> = ({ className, todo, setTodo }) => {
  return (
    <div className={cls('flex gap-2 text-base', Language.logoFont, className)}>
      <button
        className={`flex items-center gap-2 justify-center px-4 py-1 rounded ${
          todo === TodoStatus.TODO ? 'bg-blue-500 text-white grow' : 'bg-gray-200'
        }`}
        onClick={() => setTodo(TodoStatus.TODO)}
      >
        { todo === TodoStatus.TODO && (
          <BsCircle className='text-blue-700' />
        )}
        { Language.$t.Button.Todo }
      </button>
      <button
        className={`flex items-center gap-2 justify-center px-4 py-1 rounded ${
          todo === TodoStatus.COMPLETE ? 'bg-green-600 text-white grow' : 'bg-gray-200'
        }`}
        onClick={() => setTodo(TodoStatus.COMPLETE)}
      >
        { todo === TodoStatus.COMPLETE && (
          <BsCheckCircleFill className='text-green-700' />
        )}
        { Language.$t.Button.Complete }
      </button>
    </div>
  );
};

export default memo(observer(TodoHapp));
