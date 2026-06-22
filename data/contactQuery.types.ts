export type ContactQuery = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  message: string;
  createdAt: string;
};

export type ContactQueryInput = {
  name: string;
  email: string;
  phone: string;
  course?: string;
  message: string;
};
