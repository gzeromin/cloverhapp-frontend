'use client';
import { User } from '@/types/User';
import { BUCKET_URL } from '@/utils/api.util';
import Image from 'next/image';
import { memo } from 'react';

interface Props {
  user: User;
  alt: string;
  size?: number;
  className?: string;
  onClickProfile?: () => void;
}

const UserProfile: React.FC<Props> = ({
  user,
  alt,
  size = 25,
  className,
  onClickProfile,
}) => {
  return user && user.photoUrl ? (
    <Image
      src={user.photoUrl}
      alt={alt}
      className={className}
      width={size}
      height={size}
      onClick={onClickProfile}
      priority
    />
  ) : (
    <Image
      src={`${BUCKET_URL}/public/icons/user-profile.png`}
      alt={alt}
      className={className}
      width={size}
      height={size}
      onClick={onClickProfile}
      priority
    />
  );
};

export default memo(UserProfile);
