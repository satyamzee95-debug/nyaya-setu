const allowedTypes = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = /\.(pdf|jpe?g|png|webp)$/i;

export function validateDocument(file, maxSizeBytes = 10 * 1024 * 1024) {
  if (!file) return "Choose a file.";
  if (!allowedTypes.has(file.type) && !allowedExtensions.test(file.name)) {
    return "Upload a PDF, JPG, PNG, or WebP image.";
  }
  if (file.size > maxSizeBytes) return "File must be 10 MB or smaller.";
  return null;
}
