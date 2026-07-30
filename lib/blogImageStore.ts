import { Binary } from "mongodb";
import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { validateBlogImageFile } from "./blogImageValidation";
import { isFileStoreEnabled } from "./courseDetailsFileStore";
import { getMongoClient, throwMongoWriteError } from "./mongodb";

const PUBLIC_BLOGS_DIR = path.join(process.cwd(), "public", "blogs");
const DB_NAME = "germanskill";
const COLLECTION = "blog_images";

function readImageBuffer(value: unknown): Buffer | null {
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

type StoredBlogImage = {
  filename: string;
  contentType: string;
  data: Buffer;
  uploadedAt: Date;
};

export function isSafeBlogImageFilename(filename: string) {
  return /^[a-zA-Z0-9._-]+$/.test(filename);
}

export async function saveBlogImage(file: File) {
  const validation = validateBlogImageFile(file);
  if (!validation.ok) {
    throw new Error(validation.error);
  }

  const extension = validation.extension;
  const filename = `blog-${Date.now()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  if (isFileStoreEnabled()) {
    if (!existsSync(PUBLIC_BLOGS_DIR)) {
      await mkdir(PUBLIC_BLOGS_DIR, { recursive: true });
    }

    await writeFile(path.join(PUBLIC_BLOGS_DIR, filename), buffer);
    return { path: `/api/blog-images/${filename}`, filename };
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("Image upload is not configured for this environment.");
  }

  try {
    const client = await getMongoClient();
    await client
      .db(DB_NAME)
      .collection<StoredBlogImage>(COLLECTION)
      .updateOne(
        { filename },
        {
          $set: {
            filename,
            contentType: file.type || `image/${extension === "jpg" ? "jpeg" : extension}`,
            data: new Binary(buffer),
            uploadedAt: new Date(),
          },
        },
        { upsert: true },
      );
  } catch (error) {
    throwMongoWriteError(error);
  }

  return { path: `/api/blog-images/${filename}`, filename };
}

export async function getBlogImage(filename: string) {
  const safeName = decodeURIComponent(filename);

  if (!isSafeBlogImageFilename(safeName)) {
    return null;
  }

  const publicPath = path.join(PUBLIC_BLOGS_DIR, safeName);
  if (existsSync(publicPath)) {
    const data = await readFile(publicPath);
    const extension = safeName.split(".").pop()?.toLowerCase();
    const contentType =
      extension === "png"
        ? "image/png"
        : extension === "webp"
          ? "image/webp"
          : extension === "gif"
            ? "image/gif"
            : "image/jpeg";

    return { contentType, data };
  }

  if (!process.env.MONGODB_URI) {
    return null;
  }

  const client = await getMongoClient();
  const doc = await client
    .db(DB_NAME)
    .collection<StoredBlogImage>(COLLECTION)
    .findOne({ filename: safeName });

  if (!doc?.data) {
    return null;
  }

  const data = readImageBuffer(doc.data);
  if (!data) {
    return null;
  }

  return {
    contentType: doc.contentType || "application/octet-stream",
    data,
  };
}
