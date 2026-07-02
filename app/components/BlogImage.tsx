import Image, { type ImageProps } from "next/image";
import {
  resolveBlogImageSrc,
  shouldUseUnoptimizedBlogImage,
} from "../../lib/blogImageUtils";

export default function BlogImage({ src, alt = "", style, ...props }: ImageProps) {
  const resolved =
    typeof src === "string" ? resolveBlogImageSrc(src) : resolveBlogImageSrc(null);

  return (
    <Image
      {...props}
      src={resolved}
      alt={alt}
      unoptimized={shouldUseUnoptimizedBlogImage(resolved)}
      style={{ width: "100%", height: "auto", ...style }}
    />
  );
}
