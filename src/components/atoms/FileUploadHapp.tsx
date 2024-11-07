'use client';
import { GrAdd } from 'react-icons/gr';
import { useDropzone } from 'react-dropzone';
import { useCallback } from 'react';
import CarouselHapp from './CarouselHapp';
import { observer } from 'mobx-react-lite';
import { Language } from '@/mobx';

export interface FileUploadHappProps {
  uploadedImages: File[] | null | undefined;
  setUploadedImages: (file: File[] | null) => void;
  width?: number;
  height?: number;
  size?: number;
  textColor?: string;
  textSize?: string;
  className?: string;
  imageUrls?: string[];
  onDeleteImageUrls?: () => void;
}

const FileUploadHapp: React.FC<FileUploadHappProps> = ({
  uploadedImages,
  setUploadedImages,
  width = 300,
  height = 240,
  textColor = 'text-gray-500',
  textSize,
  className,
  imageUrls,
  onDeleteImageUrls,
}) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setUploadedImages(acceptedFiles);
    },
    [setUploadedImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
  });

  const deleteUploadedImages = () => {
    setUploadedImages(null);
    if (onDeleteImageUrls) {
      onDeleteImageUrls();
    }
  };

  return uploadedImages && uploadedImages.length > 0 ? (
    <CarouselHapp
      className={`${className}`}
      imageUrls={uploadedImages.map((file) => URL.createObjectURL(file))}
      deleteImageUrls={deleteUploadedImages}
    />
  ) : imageUrls && imageUrls.length > 0 ? (
    <CarouselHapp
      className={`${className}`}
      imageUrls={imageUrls}
      deleteImageUrls={deleteUploadedImages}
    />
  ) : (
    <div
      {...getRootProps()}
      className={`${width ? `w-[${width}px]` : ''} ${
        height ? `h-[${height}px]` : ''
      }  border-2 border-dashed p-8 flex items-center cursor-pointer ${
        isDragActive ? 'border-happ-focus' : 'border-gray-300'
      } ${className}`}
    >
      <input {...getInputProps()} />
      <p
        className={`grow flex flex-col items-center justify-center text-center ${textColor} ${
          textSize ? textSize : ''
        }`}
      >
        <GrAdd size="50px" />
        {Language.$t.Placeholder.FileUpload}
      </p>
    </div>
  );
};

export default observer(FileUploadHapp);
