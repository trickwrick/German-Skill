import AdminSidebar from "../_components/AdminSidebar";

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm-shell">
      <AdminSidebar />
      <main className="adm-main">{children}</main>
    </div>
  );
}
