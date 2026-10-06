import { unstable_noStore as noStore } from "next/cache";
import { getMongoClient, cleanMongoDocument } from "./mongodb";
import fs from "fs/promises";
import path from "path";

const DB_NAME = "germanskill";
const COLLECTION = "gateway_section";
const DOCUMENT_ID = "gateway_content";
const DATA_FILE = path.join(process.cwd(), "data", "gateway.json");

export type GatewayStep = {
  title: string;
  text: string;
};

export type GatewaySectionData = {
  heading: string;
  subtitle: string;
  description: string;
  stepsHeading: string;
  steps: GatewayStep[];
  imageSrc: string;
};

export const defaultGatewaySectionData: GatewaySectionData = {
  heading: "Your Gateway to German Language & Global Career Opportunities",
  subtitle: "Fluentauf helps students discover the right pathway for learning German and exploring international career opportunities in Germany.",
  description: "For German language training, students will be guided and enrolled under RM Institute, Jaipur, where they can receive structured German language training and further guidance for their Germany-focused career journey.",
  stepsHeading: "How Fluentauf Helps You",
  steps: [
    { title: "01 — Explore Your Options", text: "Understand the right German language course and career pathway based on your goals." },
    { title: "02 — Personalised Guidance", text: "Get guidance on the learning options and career pathways available for Germany." },
    { title: "03 — German Language Training", text: "Students interested in learning German will receive their language training under RM Institute, Jaipur, with guidance based on their learning level and career goals." },
    { title: "04 — Start Your Germany Journey", text: "After completing the required language training, students can receive further guidance regarding documentation, interview preparation and relevant Germany career opportunities." }
  ],
  imageSrc: "/gateway.jpg"
};

export function sanitizeGateway(value: Partial<GatewaySectionData> | null | undefined): GatewaySectionData {
  if (!value) return defaultGatewaySectionData;
  return {
    heading: typeof value.heading === "string" ? value.heading : defaultGatewaySectionData.heading,
    subtitle: typeof value.subtitle === "string" ? value.subtitle : defaultGatewaySectionData.subtitle,
    description: typeof value.description === "string" ? value.description : defaultGatewaySectionData.description,
    stepsHeading: typeof value.stepsHeading === "string" ? value.stepsHeading : defaultGatewaySectionData.stepsHeading,
    steps: Array.isArray(value.steps) ? value.steps : defaultGatewaySectionData.steps,
    imageSrc: typeof value.imageSrc === "string" ? value.imageSrc : defaultGatewaySectionData.imageSrc,
  };
}

type GatewayDocument = GatewaySectionData & { _id: string; updatedAt?: Date };

export async function getGatewayData(): Promise<GatewaySectionData> {
  noStore();
  
  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      const doc = await client.db(DB_NAME).collection<GatewayDocument>(COLLECTION).findOne({ _id: DOCUMENT_ID });
      if (doc) return sanitizeGateway(doc as Partial<GatewaySectionData>);
    } catch (error) {
      console.error("MongoDB fetch failed for gateway", error);
    }
  }
  
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return sanitizeGateway(JSON.parse(data));
  } catch {
    return defaultGatewaySectionData;
  }
}

export async function saveGatewayData(data: GatewaySectionData) {
  const sanitized = sanitizeGateway(data);
  
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(sanitized, null, 2));
  } catch (error) {
    console.error("Failed to write to local gateway.json", error);
  }

  if (process.env.MONGODB_URI) {
    try {
      const client = await getMongoClient();
      const doc = cleanMongoDocument({ _id: DOCUMENT_ID, ...sanitized, updatedAt: new Date() });
      await client.db(DB_NAME).collection<GatewayDocument>(COLLECTION).updateOne(
        { _id: DOCUMENT_ID },
        { $set: doc },
        { upsert: true }
      );
    } catch (error) {
      console.error("MongoDB save failed for gateway", error);
    }
  }
  
  return sanitized;
}
