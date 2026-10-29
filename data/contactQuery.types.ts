export type QuerySource = "contact" | "enroll" | "discount-popup";

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
  followUps?: ContactQueryFollowUp[];
  ip?: string;
  country?: string;
  region?: string;
  geoCity?: string;
  isp?: string;
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
  ip?: string;
  country?: string;
  region?: string;
  geoCity?: string;
  isp?: string;
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

export type ContactQueryFollowUp = {
  id: string;
  text: string;
  createdAt: string;
};
