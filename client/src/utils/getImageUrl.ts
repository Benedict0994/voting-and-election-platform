export function getImageUrl(imagePath: string) {
  if (!imagePath) return "";
  return `http://localhost:5000${imagePath}`;
}
