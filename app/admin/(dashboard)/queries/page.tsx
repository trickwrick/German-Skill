import AdminQueriesContent from "../../_components/AdminQueriesContent";
import { markQueriesAsSeen } from "../../../../lib/adminQuerySeenStore";
import { getContactQueries } from "../../../../lib/contactQueryStore";

export const dynamic = "force-dynamic";

export default async function AdminQueriesPage() {
  const queries = await getContactQueries();
  await markQueriesAsSeen();

  return <AdminQueriesContent initialQueries={queries} />;
}
