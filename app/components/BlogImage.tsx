import Image, { type ImageProps } from "next/image";
import {
  resolveBlogImageSrc,
  shouldUseUnoptimizedBlogImage,
} from "../../lib/blogImageUtils";

export default function BlogImage({ src, alt = "", title, style, ...props }: ImageProps) {
  const resolved =
    typeof src === "string" ? resolveBlogImageSrc(src) : resolveBlogImageSrc(null);
  const imageTitle = title ?? (typeof alt === "string" ? alt : undefined);

  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      title={imageTitle}
      unoptimized={shouldUseUnoptimizedBlogImage(resolved)}
      style={{ width: "100%", height: "auto", ...style }}
    />
  );
}
