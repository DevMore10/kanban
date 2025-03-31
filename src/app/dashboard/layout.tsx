import { SideNav } from "@/_components/Sidenav";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex">
      <div>
        <SideNav />
      </div>
      <div className="flex-1 px-10 py-2 bg-orange-100 ">{children}</div>
    </div>
  );
}
