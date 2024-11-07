import cls from 'classnames';
import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  labelName?: string;
  labelClassName?: string;
  placeholder?: string;
  error?: string;
  border?: boolean;
  marginBottom?: string;
  className?: string;
  inputClassName?: string;
  id?: string;
}

const FieldWrapperHapp: React.FC<Props> = ({ 
  children,
  labelName,
  labelClassName,
  error,
  border = true,
  marginBottom = 'mb-3',
  className,
  inputClassName,
  id,
}) => {
  return (
    <div className={cls(marginBottom, className)}>
      {labelName && (
        <label className={cls(
          'text-sm text-nowrap',
          labelClassName
        )}>
          {labelName}
        </label>
      )}
      <div className={cls('grow')}>
        <div
          className={cls(
            'w-full p-1 focus:bg-white focus:outline-none rounded',
            {
              'transition duration-200 border border-gray-400 bg-gray-50 hover:bg-white focus:border-happ-focus focus:ring-happ-focus focus:ring-4':
                border,
            },
            inputClassName,
          )}
          id={id}
        >
          {children}
        </div>
        {error && (
          <div className="mt-2 font-light text-red-500 text-xs">⚠ {error}</div>
        )}
      </div>
    </div>
  );
};

export default FieldWrapperHapp;