'use client';
import { Dialog, Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { GiConfirmed } from 'react-icons/gi';
import { VscError } from 'react-icons/vsc';
import { VscWarning } from 'react-icons/vsc';
import { VscInfo } from 'react-icons/vsc';
import { FaQuestion } from 'react-icons/fa';
import { TfiPencilAlt } from 'react-icons/tfi';
import InputHapp from '../atoms/InputHapp';
import { FormEvent, useEffect, useState } from 'react';
import { handleError } from '@/utils/error.util';

const DialogHapp: React.FC = () => {
  const [input, setInput] = useState('');

  useEffect(() => {
    setInput(Dialog.defaultInput ? Dialog.defaultInput : '');
  }, [Dialog.show]);

  const icon = () => {
    switch (Dialog.type) {
    case Dialog.SUCCESS:
      return <GiConfirmed className="text-success" />;
    case Dialog.DANGER:
      return <VscError className="text-danger" />;
    case Dialog.WARNING:
      return <VscWarning className="text-warning" />;
    case Dialog.INFO:
      return <VscInfo className="text-info" />;
    case Dialog.CONFIRM:
      return <FaQuestion className="text-primary" />;
    case Dialog.INPUT:
      return <TfiPencilAlt className="text-input" />;
    default:
      return null;
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    Loading.setIsLoading(true);
    Dialog.setInputError(undefined); // resetError
    try {
      if (Dialog.onSubmit) {
        await Dialog.onSubmit(input);
      }
    } catch (error: any) {
      handleError(error, Dialog.setInputError, true);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className={Dialog.show ? 'block' : 'hidden'} test-id="commonDialog">
      <div className="fixed z-50 inset-0 w-full h-full flex flex-col items-center justify-center">
        <div className="fixed inset-0 w-full h-full bg-black opacity-50">
          {/* Background opacity */}
        </div>
        <div className="z-50 box-border shadow-lg min-w-[300px] bg-white border border-light-black rounded-lg text-2xl">
          {/* header */}
          <div className="flex items-center border-b border-light-gray p-3">
            <span className="mt-[3px]">{icon()}</span>
            <p className="pl-1">{Dialog.title}</p>
          </div>
          {/* body */}
          <div className="p-4">
            <div className="mb-2 text-xl whitespace-pre">{Dialog.message}</div>
            {Dialog.subMessage && (
              <p className="mb-4 text-base font-light whitespace-pre break-all">
                {Dialog.subMessage}
              </p>
            )}
            {Dialog.type === Dialog.INPUT && (
              <form id="input-form" onSubmit={onSubmit}>
                <InputHapp
                  labelName={Dialog.labelName}
                  placeholder={Dialog.placeholder}
                  type={Dialog.inputType}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  error={Dialog.inputError.input}
                />
              </form>
            )}
          </div>
          {/* footer */}
          <div className="flex justify-end p-1 border-t border-light-gray">
            {(Dialog.type === Dialog.CONFIRM ||
              Dialog.type === Dialog.INPUT) && (
              <button
                className="m-1 border rounded-lg bg-cancel py-1.5 px-3 text-white font-extralight text-lg"
                onClick={() => Dialog.closeDialog(false)}
              >
                {Language.$t.Button.Cancel}
              </button>
            )}
            {Dialog.type === Dialog.INPUT ? (
              <button
                form="input-form"
                className="m-1 border rounded-lg bg-primary py-1.5 px-3 text-white font-extralight text-lg"
                type="submit"
              >
                {Language.$t.Button.Save}
              </button>
            ) : (
              <button
                className="m-1 border rounded-lg bg-primary py-1.5 px-3 text-white font-extralight text-lg"
                onClick={() => Dialog.closeDialog(true)}
              >
                {Language.$t.Button.Ok}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default observer(DialogHapp);
