const UPLOAD_MARKER = "/image/upload/";

/**
 * Injects Cloudinary's auto quality/format transformations (and an optional
 * responsive width cap) into an existing Cloudinary delivery URL. URLs that
 * aren't Cloudinary URLs (external placeholders, Unsplash, etc.) pass through
 * unchanged.
 */
export const optimizeCloudinaryUrl = (url, { width } = {}) => {
  if (!url || typeof url !== "string" || !url.includes(UPLOAD_MARKER)) {
    return url;
  }

  const transformations = ["q_auto", "f_auto"];
  if (width) transformations.push(`w_${width}`, "c_limit");

  const [prefix, suffix] = url.split(UPLOAD_MARKER);
  return `${prefix}${UPLOAD_MARKER}${transformations.join(",")}/${suffix}`;
};
