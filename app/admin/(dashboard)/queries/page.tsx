import AdminQueriesContent from "../../_components/AdminQueriesContent";
import { getContactQueries } from "../../../../lib/contactQueryStore";

export const dynamic = "force-dynamic";

export default async function AdminQueriesPage() {
  const queries = await getContactQueries();

  return <AdminQueriesContent initialQueries={queries} />;
}
