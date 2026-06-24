import { unstable_noStore as noStore } from "next/cache";
import { getMongoClient, getMongoConnectionErrorMessage, resetMongoClient } from "./mongodb";
import { blogPosts as staticBlogPosts, type BlogPost as StaticBlogPost } from "../data/blogPosts";

export type BlogPost = StaticBlogPost & {
  content?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

const DB_NAME = "germanskill";
const COLLECTION = "blog_posts";

async function getMongoCollection() {
  const client = await getMongoClient();
  return client.db(DB_NAME).collection<BlogPost>(COLLECTION);
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  noStore();
  
  if (!process.env.MONGODB_URI) {
    return staticBlogPosts;
  }

  try {
    const collection = await getMongoCollection();
    const docs = await collection.find({}).sort({ date: -1 }).toArray();
    
    // If no docs in DB, seed/fallback to static
    if (docs.length === 0) {
      return staticBlogPosts;
    }
    
    return docs.map(doc => ({
      ...doc,
      _id: undefined // Remove MongoDB _id for client serialization
    } as BlogPost));
  } catch (error) {
    console.error("Failed to fetch blog posts from DB", error);
    return staticBlogPosts;
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  noStore();
  
  if (!process.env.MONGODB_URI) {
    return staticBlogPosts.find(p => p.slug === slug) || null;
  }

  try {
    const collection = await getMongoCollection();
    const doc = await collection.findOne({ slug });
    
    if (!doc) {
      // Fallback to static if not found in DB
      return staticBlogPosts.find(p => p.slug === slug) || null;
    }
    
    return {
      ...doc,
      _id: undefined
    } as BlogPost;
  } catch (error) {
    console.error(`Failed to fetch blog post ${slug} from DB`, error);
    return staticBlogPosts.find(p => p.slug === slug) || null;
  }
}

export async function saveBlogPost(payload: BlogPost) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  const { slug } = payload;
  if (!slug?.trim()) {
    throw new Error("Blog slug is required.");
  }

  const document: BlogPost = {
    ...payload,
    updatedAt: new Date(),
  };

  async function writeDocument() {
    const collection = await getMongoCollection();
    await collection.updateOne(
      { slug }, 
      { 
        $set: document,
        $setOnInsert: { createdAt: new Date() }
      }, 
      { upsert: true }
    );
  }

  try {
    await writeDocument();
  } catch (error) {
    resetMongoClient();
    try {
      await writeDocument();
    } catch (retryError) {
      throw new Error(getMongoConnectionErrorMessage(retryError));
    }
  }

  return document;
}

export async function deleteBlogPost(slug: string) {
  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  try {
    const collection = await getMongoCollection();
    await collection.deleteOne({ slug });
    return true;
  } catch (error) {
    console.error(`Failed to delete blog post ${slug}`, error);
    throw new Error("Failed to delete blog post.");
  }
}
