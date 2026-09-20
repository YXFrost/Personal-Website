import { createImageUrlBuilder as imageUrlBuilder } from "@sanity/image-url";
const builder = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  ? imageUrlBuilder({
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    })
  : null;
export function imageInfo(image) {
  if (!image) return null;
  if (image.src?.startsWith("/") && !image.src.startsWith("//"))
    return {
      src: image.src,
      width: image.width || 1200,
      height: image.height || 800,
    };
  const ref = image.asset?._ref || image.asset?._id;
  if (!ref || !builder) return null;
  const match = ref.match(/-(\d+)x(\d+)-/);
  const originalWidth = Number(match?.[1] || 1200),
    originalHeight = Number(match?.[2] || 800);
  const crop = image.crop || {};
  const width = Math.max(
    1,
    Math.round(originalWidth * (1 - (crop.left || 0) - (crop.right || 0))),
  );
  const height = Math.max(
    1,
    Math.round(originalHeight * (1 - (crop.top || 0) - (crop.bottom || 0))),
  );
  return {
    src: builder
      .image(image)
      .width(Math.min(width, 1920))
      .fit("max")
      .auto("format")
      .quality(82)
      .url(),
    width,
    height,
  };
}
