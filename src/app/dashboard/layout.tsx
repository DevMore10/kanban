import { SideNav } from "@/_components/Sidenav";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex">
      <div>
        <SideNav />
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}
