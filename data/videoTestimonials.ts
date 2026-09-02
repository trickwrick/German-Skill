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
    id: "parthavi",
    name: "Parthavi",
    rating: 5,
    youtubeUrl: "https://youtube.com/shorts/kthSpGidl6E",
    image: "/api/blog-images/blog-1786094654093.png",
    description: "Hear how Parthavi improved their German skills with Fluent AUF live classes and exam-focused training.",
    sortOrder: 1,
    isActive: true,
  },
  {
    id: "yash",
    name: "Yash",
    rating: 5,
    youtubeUrl: "https://youtube.com/shorts/kA5CIHlzhnM",
    image: "/api/blog-images/blog-1784633039389.jpg",
    description: "Hear how Yash improved their German skills with Fluent AUF live classes and exam-focused training.",
    sortOrder: 2,
    isActive: true,
  },
  {
    id: "muskan",
    name: "Muskan",
    rating: 5,
    youtubeUrl: "https://youtube.com/shorts/SVnOJXMf8vY",
    image: "/api/blog-images/blog-1783491790744.jpg",
    description: "Hear how Muskan improved their German skills with Fluent AUF live classes and exam-focused training.",
    sortOrder: 3,
    isActive: true,
  },
  {
    id: "simaran",
    name: "Simaran",
    rating: 5,
    youtubeUrl: "https://youtube.com/shorts/RXTHWmME7iM?si=H1Vu5Iy5TQKkKXbY",
    image: "/api/blog-images/blog-1782994875941.jpg",
    description: "Hear how Simaran improved their German skills with Fluent AUF! Through expert-led live classes, personalized support, and exam-focused training, they gained the confidence to speak, understand, and excel in German. Watch their inspiring journey and see what learning with Fluent AUF is all about!",
    sortOrder: 4,
    isActive: true,
  },
  {
    id: "payal-sharma",
    name: "Manya",
    rating: 5,
    youtubeUrl: "https://youtube.com/shorts/bb7D2t1GqZQ",
    image: "/api/blog-images/blog-1782994889200.jpg",
    description: "Every success story begins with a single step. 🌟\n\nLearn how Maanya strengthened their German communication skills with Fluent AUF's expert instructors and goal-oriented training. With expert mentorship, interactive learning, and continuous support, they built the confidence to communicate in German and move closer to their goals.\n\nYour German success story could be next. 🇩🇪",
    sortOrder: 5,
    isActive: true,
  },
];
