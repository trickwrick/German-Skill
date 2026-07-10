export type VideoTestimonial = {
  id: string;
  name: string;
  rating: number;
  youtubeUrl: string;
  image: string;
  description: string;
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
    image: "/blogs/blog-1782993443682.jpg",
    description:
      "Hear how Payal improved her German skills with Fluent AUF live classes and exam-focused training.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "aditi-verma",
    name: "Aditi Verma",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    image: "/tutors/khushi-sharma.jpg",
    description:
      "Hear how Aditi improved her German skills with Fluent AUF live classes and exam-focused training.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "kunjal-mehta",
    name: "Kunjal Mehta",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    image: "/tutors/preeti-sharma.jpg",
    description:
      "Hear how Kunjal improved his German skills with Fluent AUF live classes and exam-focused training.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "preetam-singh",
    name: "Preetam Singh",
    rating: 5,
    youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    image: "/tutors/khushi-birsat.jpg",
    description:
      "Hear how Preetam improved his German skills with Fluent AUF live classes and exam-focused training.",
    sortOrder: 4,
    isActive: true,
  },
];
