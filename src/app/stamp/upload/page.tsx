'use client';
import InputHapp from '@/components/molecules/InputHapp';
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
import { StampStatus, StampType } from '@/types/Stamp';
import Image from 'next/image';
import AddTagsHapp from '@/components/atoms/AddTagsHapp';
import { Tag } from '@/types/Tag';
import { RxLockClosed, RxLockOpen2 } from 'react-icons/rx';
import { RiBardLine } from 'react-icons/ri';
import { GoPeople } from 'react-icons/go';
import CheckHapp from '@/components/atoms/CheckHapp';

const statusOptions = [
  {
    value: StampStatus.PRIVATE,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.PRIVATE,
    icon: <RxLockClosed />,
  },
  {
    value: StampStatus.FRIEND,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.FRIEND,
    icon: <GoPeople />,
  },
  {
    value: StampStatus.PUBLIC,
    labelLevel1: 'StampStatus',
    labelLevel2: StampStatus.PUBLIC,
    icon: <RxLockOpen2 />,
  },
];

const typeOptions = Object.values(StampType)
  .map(v => ({
    value: v, 
    labelLevel1: 'StampType', 
    labelLevel2: v,
    icon: <RiBardLine />,
  }));

const Upload: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [droplet, setDroplet] = useState('0');
  const [type, setType] = useState<StampType>(StampType.HAPPY);
  const [stampStatus, setStampStatus] = useState(StampStatus.PRIVATE);
  const [notForSale, setNotForSale] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    droplet?: string;
  }>({});

  const router = useRouter();

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
        JSON.stringify({ 
          name, 
          description, 
          droplet: Number(droplet), 
          type,
          notForSale,
          status: stampStatus,
          Tags: tags,
        }),
      );
      await api.post('/stamp', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      Loading.setIsLoading(false);
      const dialogReulst = await Dialog.openDialog(
        Dialog.SUCCESS,
        Language.$t.Success.UploadIcon,
      );
      if (dialogReulst) {
        setName('');
        setDescription('');
        setDroplet('0');
        setUploadedImage(null);
        setTags([]);
        setNotForSale(false);
      }
    } catch (error: any) {
      Loading.setIsLoading(false);
      handleError(error, setErrors);
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
        onClick={() => router.back()}
      />
      <div className={cls('flex items-center justify-center gap-2 lg:gap-6 lx:gap-8')}>
        {/* Drop Zone */}
        <div
          {...getRootProps()}
          className={`border-2 border-dashed p-8 text-center cursor-pointer ${
            isDragActive ? 'border-happ-focus' : 'border-gray-300'
          }`}
          id="dropZone"
        >
          <input {...getInputProps()} />
          {uploadedImage ? (
            <Image
              src={URL.createObjectURL(uploadedImage)}
              alt="Uploaded"
              className="object-cover mx-auto mb-4 rounded"
              width={180}
              height={180}
            />
          ) : (
            <p className="flex flex-col items-center justify-center w-[180px] h-[180px] text-gray-500">
              <GrAdd size="50px" />
              {Language.$t.Placeholder.FileUpload}
            </p>
          )}
        </div>

        {/* Input Zone */}
        <div className={cls('w-[270px]')}>
          <InputHapp
            className={cls('items-center flex gap-1')}
            labelName={Language.$t.Input.StampName}
            labelClassName={cls('text-xs w-1/3')}
            placeholder={Language.$t.Placeholder.StampName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            id='stampNameInput'
          />
          <div className={cls('flex items-center gap-1')}>
            <CheckHapp
              className={cls(
                'w-1/2 flex items-center',
              )}
              labelName={Language.$t.Check.NotForSale}
              labelClassName={cls('text-xs w-2/3 mr-1')}
              checked={notForSale}
              onChange={(e) => setNotForSale(e.target.checked)}
              grow={false}
              marginBottom="mb-0"
              id='notForSaleCheck'
            />
            <InputHapp
              className={cls('w-1/2 flex items-center gap-1')}
              labelName={Language.$t.Input.Droplet}
              labelClassName={cls('text-xs w-3/4')}
              placeholder={Language.$t.Placeholder.Droplet}
              type="number"
              value={droplet}
              onChange={(e) => setDroplet(e.target.value)}
              error={errors.droplet}
              min="0"
              id='dropletInput'
            />
          </div>
          <SelectHapp
            className={cls(
              'flex items-center',
              'rounded-md my-1'
            )}
            labelName={Language.$t.Select.Type}
            labelClassName={cls('text-xs w-1/3')}
            options={typeOptions}
            selected={type}
            onSelected={setType}
            id="typeSelect"
            border={true}
            dark={true}
          />
          <SelectHapp
            className={cls(
              'flex items-center',
              'rounded-md my-1'
            )}
            labelName={Language.$t.Select.StampStatus}
            labelClassName={cls('text-xs w-1/3')}
            options={statusOptions}
            selected={stampStatus}
            onSelected={setStampStatus}
            id="statusSelect"
            border={true}
            dark={true}
          />
          <TextareaHapp
            labelName={Language.$t.Input.Description}
            labelClassName={cls('text-xs')}
            placeholder={Language.$t.Placeholder.Description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
            marginBottom="mb-1"
            id='descriptionTextarea'
          />
        </div>
      </div>
      <AddTagsHapp 
        className={cls('w-2/3')}
        tags={tags}
        setTags={setTags}
        id='addTagsHapp'
      />
      <button
        className={cls(
          'absolute bottom-[30px] w-4/5 p-3', 
          'text-s tracking-wider font-bold text-white uppercase',
          'bg-primary border', 
          'hover:bg-primary-hover hover:text-primary rounded'
        )}
        onClick={onSubmit}
        id='uploadButton'
      >
        {Language.$t.Button.Upload}
      </button>
    </div>
  );
};

export default memo(observer(Upload));
