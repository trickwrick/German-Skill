import Image, { type ImageProps } from "next/image";

function isUploadedCourseImage(src: ImageProps["src"]) {
  return typeof src === "string" && src.startsWith("/api/course-images/");
}

export default function CourseImage({ alt = "", title, ...props }: ImageProps) {
  const imageTitle = title ?? (typeof alt === "string" ? alt : undefined);

  return (
    <Image
      {...props}
      alt={alt}
      title={imageTitle}
      unoptimized={isUploadedCourseImage(props.src)}
    />
  );
}
