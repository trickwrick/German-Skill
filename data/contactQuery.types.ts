export type QuerySource = "contact" | "enroll";

export type ContactQuery = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  source: QuerySource;
  city?: string;
  level?: string;
  createdAt: string;
};

export type ContactQueryInput = {
  name: string;
  email: string;
  phone: string;
  course?: string;
  message?: string;
  source?: QuerySource;
  city?: string;
  level?: string;
};

export type EnrollQueryInput = {
  name: string;
  email: string;
  phone: string;
  city: string;
  course: string;
  level: string;
  courseSlug?: string;
};
