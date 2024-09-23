'use client';
import InputHapp from '@/components/atoms/InputHapp';
import { FormEvent, memo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import api from '@/utils/api.util';
import { Dialog, Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { handleError } from '@/utils/error.util';
import TextareaHapp from '@/components/atoms/TextareaHapp';
import { useDropzone } from 'react-dropzone';
import { GrAdd } from 'react-icons/gr';
import cls from 'classnames';
import SelectHapp from '@/components/atoms/SelectHapp';
import { StampType } from '@/types/Stamp';
import Image from 'next/image';

const options = Object.values(StampType)
  .map(v => ({
    value: v, 
    labelLevel1: 'StampType', 
    labelLevel2: v,
  }));

const Upload: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [droplet, setDroplet] = useState('');
  const [type, setType] = useState<StampType>(StampType.HAPPY);
  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    droplet?: string;
  }>({});

  const router = useRouter();
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setUploadedImage(file);
    },
    [setUploadedImage],
  );

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({}); // resetError

    if (uploadedImage == null) {
      Dialog.openDialog(Dialog.WARNING, Language.$t.UploadIconImage);
      return;
    }
    Loading.setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('stamp-icon', uploadedImage);
      formData.append(
        'stamp-data',
        JSON.stringify({ name, description, droplet, type }),
      );
      await api.post('/stamp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const dialogReulst = await Dialog.openDialog(
        Dialog.SUCCESS,
        Language.$t.Success.UploadIcon,
      );
      if (dialogReulst) {
        setName('');
        setDescription('');
        setDroplet('');
        setUploadedImage(null);
      }
    } catch (error: any) {
      handleError(error, setErrors);
    } finally {
      Loading.setIsLoading(false);
    }
  };
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <div className={cls(
      'relative h-[80vh] overflow-y-auto',
      'flex flex-col items-center justify-center'
    )}>
      <IoArrowUndoCircleOutline
        className="absolute top-[30px] left-[30px] text-6xl text-primary hover:text-primary-hover cursor-pointer"
        onClick={() => router.push('/market')}
      />
      <div className={cls('flex items-center justify-center gap-2')}>
        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer ${
            isDragActive ? 'border-happ-focus' : 'border-gray-300'
          }`}
        >
          <input {...getInputProps()} />
          {uploadedImage ? (
            <Image
              src={URL.createObjectURL(uploadedImage)}
              alt="Uploaded"
              className="object-cover mx-auto mb-4 rounded"
              width={240}
              height={240}
            />
          ) : (
            <p className="flex flex-col items-center justify-center w-[240px] h-[240px] text-gray-500">
              <GrAdd size="50px" />
              Drag & drop or click to upload an image
            </p>
          )}
        </div>

        {/* Input Zone */}
        <div>
          <InputHapp
            labelName={Language.$t.Input.StampName}
            placeholder={Language.$t.Placeholder.StampName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            marginBottom="mb-2"
          />
          <TextareaHapp
            labelName={Language.$t.Input.Description}
            placeholder={Language.$t.Placeholder.Description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            marginBottom="mb-1"
          />
          <InputHapp
            labelName={Language.$t.Input.Droplet}
            placeholder={Language.$t.Placeholder.Droplet}
            type="number"
            value={droplet}
            onChange={(e) => setDroplet(e.target.value)}
            error={errors.droplet}
            marginBottom="mb-1"
            min="0"
          />
          <SelectHapp
            className={cls('rounded-md my-2 text-gray-500')}
            labelName={Language.$t.Input.Type}
            options={options}
            selected={type}
            onSelected={setType}
            testId="typeSelect"
            border={true}
            dark={true}
            wide={true}
          />
        </div>
      </div>
      <button
        className={cls(
          'absolute bottom-[30px] w-full py-3', 
          'text-s tracking-wider font-bold text-white uppercase',
          'bg-primary border', 
          'hover:bg-primary-hover hover:text-primary rounded'
        )}
        onClick={onSubmit}
      >
        {Language.$t.Button.Upload}
      </button>
    </div>
  );
};

export default memo(observer(Upload));
