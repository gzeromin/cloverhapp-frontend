'use client';
import HappCalendar from '@/components/templates/HappCalendar';
import SideBar from '@/components/templates/SideBar';
import DayLog from '@/components/templates/DayLog';

const pattern = 'pattern-cross';
const color = 'pattern-green-700';
const size = 'pattern-size-6';
const opacity = 'pattern-opacity-40';

function Home() {
  return (
    <div className="flex h-screen">
      {/* Background Pattern */}
      <div
        className={`${pattern} ${color} ${size} ${opacity} pattern-bg-white fixed top-0 left-0 right-0 bottom-0`}
      />
      <div className="relative basis-10/12 m-auto">
        {/* Web */}
        <div className="hidden lg:block p-2 rounded-lg bg-primary">
          <div className="p-2 border border-white border-dashed rounded-lg bg-primary">
            <div className="h-[600px] border-2 rounded-lg bg-white">
              <div className="flex h-full">
                <HappCalendar className="w-full lg:mr-1 lg:w-9/12" />
                <SideBar className="hidden w-3/12 ml-1 lg:block" />
              </div>
            </div>
          </div>
        </div>
        {/* Mobile */}
        <DayLog className="block lg:hidden pt-14 h-screen"/>
      </div>
    </div>
  );
}

export default Home;
