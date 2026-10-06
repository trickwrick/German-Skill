import { getGatewayData } from "../../../../lib/gatewayStore";
import AdminGatewayContent from "./_components/AdminGatewayContent"; // Force refresh

export const dynamic = "force-dynamic";

export default async function AdminGatewayPage() {
  const data = await getGatewayData();

  return <AdminGatewayContent initialData={data} />;
}
