'use client';
import LoginRequest from '@/components/templates/LoginRequest';
import SideBarLinks from '@/components/templates/SideBarLinks';
import { useAuthState } from '@/context/auth';
import { HappProvider } from '@/context/happ';
import { observer } from 'mobx-react-lite'; // Import observer
import { TimeCtrllor } from '@/mobx'; // Assuming TimeCtrllor is observable
import { useParams } from 'next/navigation';

const DashboardLayout = observer((props: {
  children: React.ReactNode;
  happCalendar: React.ReactNode;
  dayLog: React.ReactNode;
}) => {
  const { user } = useAuthState();
  const { userId } = useParams();

  const pattern = 'pattern-cross';
  const color = 'pattern-green-700';
  const size = 'pattern-size-8';
  const opacity = 'pattern-opacity-40';

  return (
    <section>
      <div className="flex h-screen">
        {/* Background Pattern */}
        <div
          className={`${pattern} ${color} ${size} ${opacity} pattern-bg-white fixed top-0 left-0 right-0 bottom-0`}
        />
        <HappProvider userId={userId} selectedDate={TimeCtrllor.formattedSelectedDate}>
          <div className="relative w-full md:basis-10/12 m-auto">
            {/* Web */}
            <div className="hidden md:block p-2 rounded-lg bg-primary">
              <div className="p-2 border border-white border-dashed rounded-lg bg-primary">
                <div className="h-[600px] border-2 rounded-lg bg-white">
                  <div className="flex h-full">
                    <div className="w-full lg:mr-1 lg:w-9/12" test-id='happCalendarSection'>
                      {props.happCalendar}
                    </div>
                    <div className="hidden w-3/12 ml-1 lg:block" test-id='sideBarSection'>
                      {/*  로그인 안했을 때 */}
                      { !user && <LoginRequest testId="loginRequestComp"/> }
                      {/* 로그인 했을 때 */}
                      { user &&
                        <div test-id="SideBarMenu">
                          <SideBarLinks />
                          {/* 사이드바 페이지 */}
                          <div className="relative w-full h-[540px]">
                            <div className="absolute inset-0 pattern-boxes pattern-gray-300 pattern-size-4" />
                            <div className="relative z-10 mt-4 h-[540px]">
                              {props.children}
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Mobile */}
            <div 
              className="block md:hidden pt-14 h-screen"
              test-id='dayLogSection'
            >
              {props.dayLog}
            </div>
          </div>
        </HappProvider>
      </div>
    </section>
  );
});

export default DashboardLayout;
