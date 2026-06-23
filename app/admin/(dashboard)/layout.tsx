import AdminSidebar from "../_components/AdminSidebar";
import { getUnseenCareerCount } from "../../../lib/adminCareerSeenStore";
import { getUnseenQueryCount } from "../../../lib/adminQuerySeenStore";
import { getCareerApplications } from "../../../lib/careerApplicationStore";
import { getContactQueries } from "../../../lib/contactQueryStore";

export const dynamic = "force-dynamic";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [queries, applications] = await Promise.all([
    getContactQueries(),
    getCareerApplications(),
  ]);
  const [unseenQueryCount, unseenCareerCount] = await Promise.all([
    getUnseenQueryCount(queries),
    getUnseenCareerCount(applications),
  ]);

  return (
    <div className="adm-shell">
      <AdminSidebar queryCount={unseenQueryCount} careerCount={unseenCareerCount} />
      <main className="adm-main">{children}</main>
    </div>
  );
}
