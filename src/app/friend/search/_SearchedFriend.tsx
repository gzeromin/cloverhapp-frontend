'use client';
import UserProrile from '@/components/molecules/UserProrile';
import { User } from '@/types/User';

interface SearchedFriendProps {
  friendUser: User;
  selectFriendUser: (user: User) => void;
}

const SearchedFriend: React.FC<SearchedFriendProps> = ({
  friendUser,
  selectFriendUser,
}) => {
  return (
    <div
      className="bg-white border border-gray-400 border-dashed pb-6 cursor-pointer rounded-md shadow-sm hover:shadow-lg hover:font-bold hover:border-2"
      id={friendUser.id}
      onClick={() => selectFriendUser(friendUser)}
    >
      {friendUser && (
        <UserProrile
          user={friendUser}
          alt={friendUser.id}
          size={110}
          className="rounded-full mx-auto pt-4 object-contain aspect-square"
        />
      )}
      <div className="text-center">
        <p className="">{friendUser.nickname}</p>
        <p className="text-xs text-gray-500 break-all">{friendUser.email}</p>
      </div>
    </div>
  );
};

export default SearchedFriend;
