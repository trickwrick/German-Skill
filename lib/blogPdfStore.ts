import { Binary } from "mongodb";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { validateBlogPdfFile } from "./blogPdfValidation";
import { isFileStoreEnabled } from "./courseDetailsFileStore";
import { getMongoClient, throwMongoWriteError } from "./mongodb";

const PUBLIC_BLOG_PDFS_DIR = path.join(process.cwd(), "public", "blog-pdfs");
const DB_NAME = "germanskill";
const COLLECTION = "blog_pdfs";

function readFileBuffer(value: unknown): Buffer | null {
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

type StoredBlogPdf = {
  filename: string;
  contentType: string;
  data: Buffer;
  uploadedAt: Date;
};

export function isSafeBlogPdfFilename(filename: string) {
  return /^[a-zA-Z0-9._-]+\.pdf$/i.test(filename);
}

export async function saveBlogPdf(file: File) {
  const validation = validateBlogPdfFile(file);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const filename = `blog-pdf-${Date.now()}.pdf`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isFileStoreEnabled()) {
    if (!existsSync(PUBLIC_BLOG_PDFS_DIR)) {
      await mkdir(PUBLIC_BLOG_PDFS_DIR, { recursive: true });
    }

    await writeFile(path.join(PUBLIC_BLOG_PDFS_DIR, filename), buffer);
    return { path: `/api/blog-pdfs/${filename}`, filename };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("PDF upload is not configured for this environment.");
  }

  try {
    const client = await getMongoClient();
    await client
      .db(DB_NAME)
      .collection<StoredBlogPdf>(COLLECTION)
      .updateOne(
        { filename },
        {
          $set: {
            filename,
            contentType: "application/pdf",
            data: buffer,
            uploadedAt: new Date(),
          },
        },
        { upsert: true },
      );
  } catch (error) {
    throwMongoWriteError(error);
  }

  return { path: `/api/blog-pdfs/${filename}`, filename };
}

export async function getBlogPdf(filename: string) {
  const safeName = decodeURIComponent(filename);

  if (!isSafeBlogPdfFilename(safeName)) {
    return null;
  }

  const publicPath = path.join(PUBLIC_BLOG_PDFS_DIR, safeName);
  if (existsSync(publicPath)) {
    const data = await readFile(publicPath);
    return { contentType: "application/pdf", data };
  }

  if (!process.env.MONGODB_URI) {
    return null;
  }

  const client = await getMongoClient();
  const doc = await client.db(DB_NAME).collection<StoredBlogPdf>(COLLECTION).findOne({ filename: safeName });

  if (!doc?.data) {
    return null;
  }

  const data = readFileBuffer(doc.data);
  if (!data) {
    return null;
  }

  return {
    contentType: doc.contentType || "application/pdf",
    data,
  };
}
