import Image from "next/image";
import { imageInfo } from "@/lib/images";
import ImageLightbox from "./ImageLightbox";
export default function ResponsiveImage({
  image,
  priority = false,
  sizes = "(max-width: 768px) calc(100vw - 40px), 760px",
  className = "",
  decorative = false,
  zoomable = false,
}) {
  const info = imageInfo(image);
  if (!info) return null;
  const rendered = (
    <Image
      {...info}
      alt={decorative ? "" : image.alt || ""}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{
        objectPosition: `${(image.hotspot?.x ?? 0.5) * 100}% ${(image.hotspot?.y ?? 0.5) * 100}%`,
      }}
    />
  );
  return zoomable ? <ImageLightbox info={info} alt={image.alt || ""}>{rendered}</ImageLightbox> : rendered;
}
