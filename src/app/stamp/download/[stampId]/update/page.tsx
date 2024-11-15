'use client';
import InputHapp from '@/components/molecules/InputHapp';
import { FormEvent, memo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { IoArrowUndoCircleOutline } from 'react-icons/io5';
import api from '@/utils/api.util';
import { Dialog, Language, Loading } from '@/mobx';
import { observer } from 'mobx-react-lite';
import { handleError } from '@/utils/error.util';
import TextareaHapp from '@/components/molecules/TextareaHapp';
import cls from 'classnames';
import SelectHapp from '@/components/molecules/SelectHapp';
import { Stamp, StampStatus, StampType } from '@/types/Stamp';
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

  interface Props {
    params: { stampId: string };
  }

const Update: React.FC<Props> = ({ params }: Props) => {
  const { stampId } = params;
  const [iconUrl, setIconUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [droplet, setDroplet] = useState('0');
  const [type, setType] = useState<StampType>(StampType.HAPPY);
  const [stampStatus, setStampStatus] = useState(StampStatus.PRIVATE);
  const [notForSale, setNotForSale] = useState<boolean>(false);
  const [tags, setTags] = useState<Tag[]>([]);

  const [errors, setErrors] = useState<{
    name?: string;
    description?: string;
    droplet?: string;
  }>({});

  const router = useRouter();

  useEffect(() => {
    api.get('/stamp/' + stampId).then((res) => {
      const data: Stamp = res.data;
      setIconUrl(data.url);
      setName(data.name);
      setDescription(data.description);
      setDroplet(String(data.droplet));
      setType(data.type);
      setStampStatus(data.status);
      setNotForSale(data.notForSale);
      setTags(data.Tags);
    }).catch((error) => {
      handleError(error);
    });
  }, [stampId]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({}); // resetError

    Loading.setIsLoading(true);
    try {
      const stamp = {
        id: stampId,
        name, 
        description, 
        droplet: Number(droplet), 
        type,
        notForSale,
        status: stampStatus,
        Tags: tags,
      };
      await api.patch('/stamp', stamp);
      Loading.setIsLoading(false);
      const dialogReulst = await Dialog.openDialog(
        Dialog.SUCCESS,
        Language.$t.Success.StampEdit,
      );
      if (dialogReulst) {
        router.back();
      }
    } catch (error: any) {
      console.log('????');
      console.log(error);
      Loading.setIsLoading(false);
      handleError(error, setErrors);
    }
  };
  
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
        {/* Stamp Icon */}
        <div className={cls('w-1/2')}>
          {iconUrl && (
            <Image
              src={iconUrl}
              alt={stampId}
              className="m-auto p-6 object-contain aspect-square"
              priority={false}
              width={250}
              height={250}
            />
          )}
        </div>

        {/* Input Zone */}
        <div className={cls('w-[270px]')}>
          <InputHapp
            id='stampUpdate-stampNameInput'
            className={cls('flex items-center gap-1')}
            labelName={Language.$t.Input.StampName}
            labelClassName={cls('text-xs w-1/3')}
            placeholder={Language.$t.Placeholder.StampName}
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
          />
          <div className={cls('flex items-center gap-1')}>
            <CheckHapp
              id='stampUpdate-notForSaleCheck'
              className={cls(
                'w-1/2 flex items-center',
              )}
              labelName={Language.$t.Check.NotForSale}
              labelClassName={cls('text-xs w-2/3 mr-1')}
              checked={notForSale}
              onChange={(e) => setNotForSale(e.target.checked)}
              grow={false}
              marginBottom="mb-0"
            />
            <InputHapp
              id='stampUpdate-dropletInput'
              className={cls('w-1/2 flex gap-3 items-center')}
              labelName={Language.$t.Input.Droplet}
              labelClassName={cls('text-xs w-3/4')}
              placeholder={Language.$t.Placeholder.Droplet}
              type="number"
              value={droplet}
              onChange={(e) => setDroplet(e.target.value)}
              error={errors.droplet}
              min="0"
              marginBottom='mb-0'
            />
          </div>
          <SelectHapp
            id="stampUpdate-typeSelect"
            className={cls(
              'flex items-center',
              'rounded-md my-1'
            )}
            labelName={Language.$t.Select.Type}
            labelClassName={cls('text-xs w-1/3')}
            options={typeOptions}
            selected={type}
            onSelected={setType}
            border={true}
            dark={true}
          />
          <SelectHapp
            id="stampUpdate-statusSelect"
            className={cls(
              'flex items-center',
              'rounded-md my-1'
            )}
            labelName={Language.$t.Select.StampStatus}
            labelClassName={cls('text-xs w-1/3')}
            options={statusOptions}
            selected={stampStatus}
            onSelected={setStampStatus}
            border={true}
            dark={true}
          />
          <TextareaHapp
            id='stampUpdate-descriptionTextarea'
            labelName={Language.$t.Input.Description}
            labelClassName={cls('text-xs')}
            placeholder={Language.$t.Placeholder.Description}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={errors.description}
          />
        </div>
      </div>
      <AddTagsHapp 
        className={cls('w-2/3')}
        tags={tags}
        setTags={setTags}
        id='stampUpdate-addTagsHapp'
      />
      {/* footer */}
      <div className={cls(
        'absolute w-full bottom-0 p-5',
        'grid grid-flow-col items-center justify-stretch gap-5', 
      )}>
        <button
          className={cls(
            'm-1 py-1.5 px-3 rounded-lg text-lg',
            'tracking-wider font-bold text-white uppercase',
            'bg-cancel border border-cancel', 
            'hover:bg-gray-100 hover:text-cancel',
            'transition-colors duration-300 ease-in-out'
          )}
          onClick={() => router.back()}
          id="stampUpdate-cancelButton"
        >
          {Language.$t.Button.Cancel}
        </button>
        <button 
          className={cls(
            'm-1 py-1.5 px-3 rounded-lg text-lg',
            'tracking-wider font-bold text-white uppercase',
            'bg-blue-700 border border-blue-700', 
            'hover:bg-blue-100 hover:text-blue-700',
            'transition-colors duration-300 ease-in-out'
          )}
          onClick={onSubmit}
          id="stampUpdate-editButton"
        >
          {Language.$t.Button.Edit}
        </button>
      </div>
    </div>
  );
};

export default memo(observer(Update));
