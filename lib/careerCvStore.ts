import { Binary } from "mongodb";
import { existsSync } from "fs";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getCareerCvExtension, isAcceptedCareerCv } from "./careerCvValidation";
import { isFileStoreEnabled } from "./courseDetailsFileStore";
import { getMongoClient } from "./mongodb";

const PUBLIC_CAREER_CVS_DIR = path.join(process.cwd(), "public", "career-cvs");
const DB_NAME = "germanskill";
const COLLECTION = "career_cvs";

type StoredCareerCv = {
  filename: string;
  contentType: string;
  data: Buffer;
  uploadedAt: Date;
};

function readCvBuffer(value: unknown): Buffer | null {
  if (!value) {
    return null;
  }

  if (Buffer.isBuffer(value)) {
    return value;
  }

  if (value instanceof Binary) {
    return Buffer.from(value.buffer);
  }

  if (value instanceof Uint8Array) {
    return Buffer.from(value);
  }

  return null;
}

function getCvExtension(file: File) {
  return getCareerCvExtension(file);
}

export { isAcceptedCareerCv };

export function isSafeCareerCvFilename(filename: string) {
  return /^career-cv-[a-z0-9-]+\.(pdf|doc|docx)$/i.test(filename);
}

export async function saveCareerCv(file: File, applicationId: string) {
  const extension = getCvExtension(file);
  if (!extension) {
    throw new Error("Please upload a PDF, DOC, or DOCX file.");
  }

  const maxSizeMb = 5;
  if (file.size > maxSizeMb * 1024 * 1024) {
    throw new Error(`CV must be ${maxSizeMb}MB or smaller.`);
  }

  const safeId = applicationId.replace(/[^a-z0-9-]/gi, "").toLowerCase();
  const filename = `career-cv-${safeId}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType =
    file.type ||
    (extension === "pdf"
      ? "application/pdf"
      : extension === "doc"
        ? "application/msword"
        : "application/vnd.openxmlformats-officedocument.wordprocessingml.document");

  if (isFileStoreEnabled()) {
    if (!existsSync(PUBLIC_CAREER_CVS_DIR)) {
      await mkdir(PUBLIC_CAREER_CVS_DIR, { recursive: true });
    }

    await writeFile(path.join(PUBLIC_CAREER_CVS_DIR, filename), buffer);
    return { filename, path: `/career-cvs/${filename}` };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("CV upload is not configured for this environment.");
  }

  const client = await getMongoClient();
  await client
    .db(DB_NAME)
    .collection<StoredCareerCv>(COLLECTION)
    .updateOne(
      { filename },
      {
        $set: {
          filename,
          contentType,
          data: buffer,
          uploadedAt: new Date(),
        },
      },
      { upsert: true },
    );

  return { filename, path: `/api/admin/career-cvs/${filename}` };
}

export async function getCareerCv(filename: string) {
  if (!isSafeCareerCvFilename(filename)) {
    return null;
  }

  if (isFileStoreEnabled()) {
    const { readFile } = await import("fs/promises");
    const filePath = path.join(PUBLIC_CAREER_CVS_DIR, filename);

    if (!existsSync(filePath)) {
      return null;
    }

    const data = await readFile(filePath);
    const extension = filename.split(".").pop()?.toLowerCase();
    const contentType =
      extension === "pdf"
        ? "application/pdf"
        : extension === "doc"
          ? "application/msword"
          : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    return { contentType, data };
  }

  if (!process.env.MONGODB_URI) {
    return null;
  }

  const client = await getMongoClient();
  const doc = await client.db(DB_NAME).collection<StoredCareerCv>(COLLECTION).findOne({ filename });

  if (!doc?.data) {
    return null;
  }

  const data = readCvBuffer(doc.data);
  if (!data) {
    return null;
  }

  return {
    contentType: doc.contentType || "application/octet-stream",
    data,
  };
}

export async function deleteCareerCv(filename: string) {
  if (!isSafeCareerCvFilename(filename)) {
    return false;
  }

  if (isFileStoreEnabled()) {
    const { unlink } = await import("fs/promises");
    const filePath = path.join(PUBLIC_CAREER_CVS_DIR, filename);

    if (!existsSync(filePath)) {
      return false;
    }

    await unlink(filePath);
    return true;
  }

  if (!process.env.MONGODB_URI) {
    return false;
  }

  const client = await getMongoClient();
  const result = await client.db(DB_NAME).collection(COLLECTION).deleteOne({ filename });
  return result.deletedCount > 0;
}
