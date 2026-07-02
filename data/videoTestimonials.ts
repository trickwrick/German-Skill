export type VideoTestimonial = {
  id: string;
  name: string;
  rating: number;
  youtubeUrl: string;
  image: string;
  sortOrder: number;
  isActive: boolean;
};

export const videoTestimonialRatingOptions = [1, 2, 3, 4, 4.2, 4.6, 4.8, 5] as const;

export const defaultVideoTestimonials: VideoTestimonial[] = [
  {
    id: "payal-sharma",
    name: "Payal Sharma",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    image: "/webinar-student.jpg",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "aditi-verma",
    name: "Aditi Verma",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    image: "/hero-students.jpg",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "kunjal-mehta",
    name: "Kunjal Mehta",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    image: "/portal-education.jpg",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "preetam-singh",
    name: "Preetam Singh",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    image: "/webinar-student.jpg",
    sortOrder: 4,
    isActive: true,
  },
];
