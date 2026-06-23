import AdminCareersContent from "../../_components/AdminCareersContent";
import { markCareersAsSeen } from "../../../../lib/adminCareerSeenStore";
import { getCareerApplications } from "../../../../lib/careerApplicationStore";

export const dynamic = "force-dynamic";

export default async function AdminCareersPage() {
  const applications = await getCareerApplications();
  await markCareersAsSeen();

  return <AdminCareersContent initialApplications={applications} />;
}
