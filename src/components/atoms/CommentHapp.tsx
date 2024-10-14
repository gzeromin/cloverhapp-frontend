'use client';
import { Language, Loading } from '@/mobx';
import cls from 'classnames';
import { memo, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import TextareaHapp from './TextareaHapp';
import { LuSendHorizonal } from 'react-icons/lu';
import { User } from '@/types/User';
import api from '@/utils/api.util';
import { Comment } from '@/types/Comment';
import DateUtils from '@/utils/date.util';
import { FaCommentAlt } from 'react-icons/fa';
import UserProrile from '../molecules/UserProrile';

interface Props {
  className?: string;
  happId: string;
  user: User | undefined;
  Comments: Comment[] | undefined;
}

const CommentHapp: React.FC<Props> = ({
  className,
  happId,
  user,
  Comments,
}) => {
  const [commentList, setCommentList] = useState<Comment[]>();
  const [show, setShow] = useState<boolean>(false);
  const [comment, setComment] = useState('');

  useEffect(() => {
    // Comments props이 변경될 때마다 commentList 업데이트
    setCommentList(Comments);
    if (Comments) setShow(true);
  }, [Comments]);

  const onCreateComment = async () => {
    Loading.setIsLoading(true);
    try {
      const res = await api.post('/comment/happ', {
        User: user,
        body: comment,
        happId,
      });
      if (commentList) {
        setCommentList([res.data, ...commentList]);
      }
      setComment('');
    } catch (error: any) {
      console.log(error);
    } finally {
      Loading.setIsLoading(false);
    }
  };

  return (
    <div className={cls(className, 'flex flex-col gap-1')}>
      <div
        className="flex gap-1 items-center text-gray-600 justify-start text-sm"
        onClick={() => setShow((prev) => !prev)}
      >
        <FaCommentAlt className={cls({ 'text-primary-100': show })} />{' '}
        {commentList && commentList.length} Comments
      </div>
      {show && (
        <>
          {user && (
            <div className="flex items-start justify-between gap-1 pr-1 bg-gray-100 rounded-md">
              <UserProrile
                user={user}
                alt={`comment ${happId} ${user.id}`}
                size={40}
                className="rounded-full mt-3 ml-1"
              />
              <TextareaHapp
                placeholder={Language.$t.Placeholder.Memo}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={1}
                textAreaClassName="bg-transparent"
                className="grow text-base"
                marginBottom=""
                border={false}
                autoHeight={true}
                resizable={false}
              />
              <LuSendHorizonal
                className={
                  'mt-3 mr-1 p-1 text-3xl text-gray-700 cursor-point rounded-full hover:bg-gray-200'
                }
                onClick={onCreateComment}
              />
            </div>
          )}

          <div className="max-h-[200px] overflow-y-scroll rounded">
            {commentList &&
              commentList.map((comment, i) => (
                <div
                  className="flex items-start gap-3 my-2"
                  key={`${happId} ${comment.id} ${i}`}
                >
                  <UserProrile
                    user={comment.User}
                    alt={`comment ${comment.id} ${comment.User.id}`}
                    size={40}
                    className="rounded-full my-1 ml-1"
                  />
                  <span className="flex flex-col gap-1">
                    <span className="flex gap-2 items-end">
                      <span className="text-sm font-semibold">
                        {comment.User.nickname}
                      </span>
                      <span className="text-xs text-gray-500">
                        {DateUtils.getFormatDateHourMin(
                          new Date(comment.createdAt),
                        )}
                      </span>
                    </span>
                    <div className="px-2 py-1 rounded-lg max-w-[350px] break-all bg-white text-sm">
                      {comment.body}
                    </div>
                  </span>
                </div>
              ))}
          </div>
        </>
      )}
    </div>
  );
};

export default memo(observer(CommentHapp));
