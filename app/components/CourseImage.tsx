import Image, { type ImageProps } from "next/image";

function isUploadedCourseImage(src: ImageProps["src"]) {
  return typeof src === "string" && src.startsWith("/api/course-images/");
}

export default function CourseImage(props: ImageProps) {
  return <Image {...props} unoptimized={isUploadedCourseImage(props.src)} />;
}
