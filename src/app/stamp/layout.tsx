'use client';

import LoginRequest from '@/components/templates/LoginRequest';
import { useAuthState } from '@/context/auth';

export default function DashboardLayout(props: {
  children: React.ReactNode;
  userInfo: React.ReactNode;
  userStamps: React.ReactNode;
}) {
  const { user } = useAuthState();
  return (
    <section>
      <div className="mt-[60px] max-w-6xl m-auto">
        <div className="flex">
          <div className="w-2/3">
            {props.children}
          </div>
          {/*  로그인 안했을 때 */}
          { !user && (
            <div className="w-1/3">
              <LoginRequest dataCy="stamp-loginRequestComp"/> 
            </div>
          )}
          {/* 로그인 했을 때 */}
          { user && (
            <div className="relative w-1/3 border-r-2 border-gray-100">
              <div className="h-[11vh]">{props.userInfo}</div>
              <div className="h-[4vh]">
                <div className="flex justify-around">
                  <span className="font-bold">m</span>
                  <span className="font-semibold bg-primary-hover text-primary -skew-x-6">
                    y
                  </span>
                  <span className="font-medium text-droplet"></span>
                  <span className="font-nomal">s</span>
                  <span className="font-normal skew-y-12 text-primary">t</span>
                  <span className="font-bold text-gray-400">a</span>
                  <span className="font-light text-droplet">m</span>
                  <span className="font-medium bg-gray-200 text-primary skew-x-12">
                    p
                  </span>
                  <span className="font-light">s</span>
                </div>
              </div>
              <div className="-z-10 absolute top-[15vh] left-0 right-0 bottom-0 h-[75vh] pattern-boxes pattern-gray-300 pattern-size-4" />
              {props.userStamps}
            </div>
          ) }
        </div>
      </div>
    </section>
  );
}
