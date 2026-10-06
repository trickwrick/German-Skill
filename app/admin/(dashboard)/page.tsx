import AdminDashboardContent from "../_components/AdminDashboardContent";
import { getBlogPosts } from "../../../lib/blogStore";
import { getContactQueries } from "../../../lib/contactQueryStore";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [blogPosts, queries] = await Promise.all([
    getBlogPosts({ fresh: true }),
    getContactQueries()
  ]);
  
  return <AdminDashboardContent blogCount={blogPosts.length} queryCount={queries.length} />;
}
