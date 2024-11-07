'use client';
import cls from 'classnames';
import { TextareaHTMLAttributes, useEffect, useRef } from 'react';
import LabelHapp from '../atoms/LabelHapp';
import ErrorMessageHapp from '../atoms/ErrorMessageHapp';

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  labelName?: string;
  labelClassName?: string;
  placeholder?: string;
  error?: string;
  rows?: number;
  border?: boolean;
  className?: string;
  textAreaClassName?: string;
  disable?: boolean;
  autoHeight?: boolean;
  resizable?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  grow?: boolean;
}

const TextareaHapp: React.FC<Props> = ({
  id,
  labelName = '',
  labelClassName,
  placeholder = '',
  error,
  rows = 2,
  border = true,
  className,
  textAreaClassName,
  disable = false,
  autoHeight = false,
  resizable = true,
  value = '',
  onChange,
  grow = true,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null!);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const currentTextarea = textareaRef.current;
    if (currentTextarea) {
      currentTextarea.style.height = 'auto';
      currentTextarea.style.height = `${currentTextarea.scrollHeight}px`;
    }
    if (onChange) {
      onChange(e);
    }
  };

  useEffect(() => {
    if (autoHeight && textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [value, autoHeight]);

  return (
    <div
      className={cls(
        'relative mb-6',
        className,
      )}
    >
      <LabelHapp
        htmlFor={id}
        className={labelClassName}
      >
        {labelName}
      </LabelHapp>
      <div className={cls({'grow': grow})}>
        <textarea
          id={id}
          style={{ minWidth: 120 }}
          className={cls(
            'w-full p-2 mt-1 rounded focus:outline-none',
            { 'border-red-500': error },
            {
              'transition duration-200 border border-gray-400 bg-gray-50 focus:bg-white hover:bg-white focus:border-happ-focus focus:ring-happ-focus focus:ring-4':
                border,
            },
            { 'resize-none': !resizable },
            'whitespace-pre-wrap', // 개행 유지
            textAreaClassName,
          )}
          rows={rows}
          placeholder={placeholder ? placeholder : labelName}
          disabled={disable}
          value={value}
          ref={textareaRef}
          onChange={handleChange}
        />
        {error && (
          <div className="absolute">
            <ErrorMessageHapp>
              {error}
            </ErrorMessageHapp>
          </div>
        )}
      </div>
    </div>
  );
};

export default TextareaHapp;
