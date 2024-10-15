'use client';
import cls from 'classnames';
import { TextareaHTMLAttributes, useEffect, useRef } from 'react';

interface TextareaHappProps
  extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  labelName?: string;
  labelClassName?: string;
  placeholder?: string;
  error?: string;
  rows?: number;
  border?: boolean;
  marginBottom?: string;
  className?: string;
  textAreaClassName?: string;
  disable?: boolean;
  autoHeight?: boolean;
  resizable?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  grow?: boolean;
  dataCy?: string;
}

const TextareaHapp: React.FC<TextareaHappProps> = ({
  labelName = '',
  labelClassName,
  placeholder = '',
  error,
  rows = 2,
  border = true,
  marginBottom = 'mb-3',
  className,
  textAreaClassName,
  disable = false,
  autoHeight = false,
  resizable = true,
  value = '',
  onChange,
  grow = true,
  dataCy,
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
        error ? 'mb-1' : marginBottom,
        className,
      )}
    >
      {labelName && (
        <label className={cls(
          'text-sm text-nowrap',
          labelClassName
        )}>
          {labelName}
        </label>
      )}
      <div className={cls({'grow': grow})}>
        <textarea
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
          data-cy={dataCy}
        />
        {error && (
          <div className="mt-2 font-light text-red-500 text-xs">⚠ {error}</div>
        )}
      </div>
    </div>
  );
};

export default TextareaHapp;
