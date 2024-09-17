import { memo } from 'react';

interface Props {}

const Profile: React.FC<Props> = () => {
  return (
    <div className="flex flex-col p-6">
      {/* Photo */}
      <img
        src="https://source.unsplash.com/200x200/?portrait?2"
        alt=""
        className="flex-shrink-0 object-cover rounded-sm dark:bg-gray-500 aspect-square"
      />
      {/* 자기소개 */}
      <div className="mt-2">
        <h2 className="text-xl font-semibold">Leroy Jenkins</h2>
        <span className="block pb-2 text-sm dark:text-gray-400">
          CTO of Company Inc.
        </span>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
          Reprehenderit, eligendi dolorum sequi illum qui unde aspernatur non
          deserunt
        </p>
      </div>
    </div>
  );
};

export default memo(Profile);
