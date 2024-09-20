'use client';

export default function DashboardLayout(props: {
  children: React.ReactNode;
  userInfo: React.ReactNode;
  userStamps: React.ReactNode;
}) {
  return (
    <section>
      <div className="mt-[60px] max-w-6xl m-auto">
        {/* header */}
        <div className="flex">
          <div className="w-2/3">
            <div className="flex justify-center text-4xl mx-5 border-b-2 border-dashed">
              <div className="flex">
                <span className="font-bold">s</span>
                <span className="font-normal bg-primary text-white skew-x-12">
                  t
                </span>
                <span className="font-medium">a</span>
                <span className="font-light">m</span>
                <span className="font-semibold text-primary mr-3">p</span>
                <span className="font-normal">s</span>
                <span className="font-bold">h</span>
                <span className="font-light">o</span>
                <span className="font-medium bg-primary text-white -skew-x-6">
                  p
                </span>
              </div>
            </div>
            <div>{props.children}</div>
          </div>
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
        </div>
      </div>
    </section>
  );
}
