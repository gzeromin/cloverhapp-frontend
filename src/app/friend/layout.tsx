export default function DashboardLayout(props: {
  children: React.ReactNode;
  menu: React.ReactNode;
}) {
  return (
    <section>
      <div className="mt-[54px] h-[94vh] max-w-5xl mx-auto flex relative">
        {/* Navigation */}
        <div className="w-1/4 flex flex-col">{props.menu}</div>
        {/* Content */}
        <div className="w-3/4 overflow-y-auto">{props.children}</div>
      </div>
    </section>
  );
}
