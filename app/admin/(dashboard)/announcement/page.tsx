import { getAnnouncementData } from "../../../../lib/announcementStore";
import AdminAnnouncementContent from "../../_components/AdminAnnouncementContent";

export const dynamic = "force-dynamic";

export default async function AdminAnnouncementPage() {
  const data = await getAnnouncementData();

  return <AdminAnnouncementContent initialData={data} />;
}

