import { NextResponse } from "next/server";
import { saveGatewayData, type GatewaySectionData } from "../../../../lib/gatewayStore";

export async function POST(request: Request) {
  try {
    const data = (await request.json()) as GatewaySectionData;
    const result = await saveGatewayData(data);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to save gateway data", error);
    return NextResponse.json({ error: "Failed to save data" }, { status: 500 });
  }
}
