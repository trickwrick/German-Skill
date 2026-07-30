import { cache } from "react";
import { getBlogPostBySlug, getBlogPosts } from "./blogStore";

export const getCachedBlogPostBySlug = cache((slug: string) => getBlogPostBySlug(slug));

export const getCachedBlogPosts = cache(() => getBlogPosts());
