export type CareerApplication = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  germanLevel: string;
  experience: string;
  certification?: string;
  about: string;
  cvFileName: string;
  cvOriginalName: string;
  createdAt: string;
};

export type CareerApplicationInput = {
  name: string;
  email: string;
  phone: string;
  city: string;
  germanLevel: string;
  experience: string;
  certification?: string;
  about: string;
};
