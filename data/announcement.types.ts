export type AnnouncementItem = {
  text: string;
  highlight?: string;
  rest?: string;
};

export const defaultAnnouncements: AnnouncementItem[] = [
  {
    text: "Trusted by",
    highlight: "16,500+",
    rest: "students learning German with us",
  },
  {
    text: "German Made Easy — Learn Anytime, Anywhere",
  },
  {
    text: "A1–C2 Goethe Certified Live Online Classes",
  },
  {
    text: "Flexible Batches | Expert Tutors | Study Material Included",
  },
];

export type TopAnnouncementData = {
  customText: string;
  isActive: boolean;
};

export const defaultAnnouncementData: TopAnnouncementData = {
  customText: "",
  isActive: true,
};

