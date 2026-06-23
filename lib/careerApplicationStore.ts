import { randomUUID } from "crypto";
import { unstable_noStore as noStore } from "next/cache";
import type { CareerApplication, CareerApplicationInput } from "../data/careerApplication.types";
import {
  addFileCareerApplication,
  deleteFileCareerApplication,
  getFileCareerApplications,
} from "./careerApplicationsFileStore";
import { deleteCareerCv, saveCareerCv } from "./careerCvStore";
import { isFileStoreEnabled } from "./courseDetailsFileStore";
import { getMongoClient, getMongoConnectionErrorMessage, resetMongoClient } from "./mongodb";

const DB_NAME = "germanskill";
const COLLECTION = "career_applications";

async function getMongoCareerApplications(): Promise<CareerApplication[]> {
  if (!process.env.MONGODB_URI) {
    return [];
  }

  const client = await getMongoClient();
  const docs = await client
    .db(DB_NAME)
    .collection<CareerApplication>(COLLECTION)
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return docs;
}

async function insertMongoCareerApplication(application: CareerApplication) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured. Add it in your hosting environment variables.");
  }

  async function writeApplication() {
    const client = await getMongoClient();
    await client.db(DB_NAME).collection<CareerApplication>(COLLECTION).insertOne(application);
  }

  try {
    await writeApplication();
  } catch (error) {
    resetMongoClient();

    try {
      await writeApplication();
    } catch (retryError) {
      throw new Error(getMongoConnectionErrorMessage(retryError));
    }
  }

  return application;
}

async function removeMongoCareerApplication(id: string) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured. Add it in your hosting environment variables.");
  }

  const client = await getMongoClient();
  const result = await client.db(DB_NAME).collection<CareerApplication>(COLLECTION).deleteOne({ id });

  return result.deletedCount > 0;
}

export async function getCareerApplications(): Promise<CareerApplication[]> {
  noStore();

  if (isFileStoreEnabled()) {
    try {
      const fileApplications = await getFileCareerApplications();
      if (fileApplications) {
        return fileApplications;
      }
    } catch {
      // Fall through to MongoDB.
    }
  }

  try {
    if (process.env.MONGODB_URI) {
      return await getMongoCareerApplications();
    }
  } catch {
    // No stored applications available.
  }

  return [];
}

export async function saveCareerApplication(
  input: CareerApplicationInput,
  cvFile: File,
): Promise<CareerApplication> {
  const id = randomUUID();
  const { filename } = await saveCareerCv(cvFile, id);

  const application: CareerApplication = {
    id,
    name: input.name.trim(),
    email: input.email.trim(),
    phone: input.phone.trim(),
    city: input.city.trim(),
    germanLevel: input.germanLevel.trim(),
    experience: input.experience.trim(),
    certification: input.certification?.trim() || undefined,
    about: input.about.trim(),
    cvFileName: filename,
    cvOriginalName: cvFile.name.trim(),
    createdAt: new Date().toISOString(),
  };

  if (isFileStoreEnabled()) {
    await addFileCareerApplication(application);

    if (process.env.MONGODB_URI) {
      try {
        await insertMongoCareerApplication(application);
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    return application;
  }

  return insertMongoCareerApplication(application);
}

export async function deleteCareerApplication(id: string) {
  if (!id.trim()) {
    return false;
  }

  const applications = await getCareerApplications();
  const application = applications.find((item) => item.id === id);

  if (isFileStoreEnabled()) {
    const removed = await deleteFileCareerApplication(id);

    if (application?.cvFileName) {
      try {
        await deleteCareerCv(application.cvFileName);
      } catch {
        // Continue even if CV cleanup fails.
      }
    }

    if (process.env.MONGODB_URI) {
      try {
        await removeMongoCareerApplication(id);
      } catch {
        // Local file store remains the source of truth in development.
      }
    }

    return removed;
  }

  const removed = await removeMongoCareerApplication(id);

  if (removed && application?.cvFileName) {
    try {
      await deleteCareerCv(application.cvFileName);
    } catch {
      // Continue even if CV cleanup fails.
    }
  }

  return removed;
}
