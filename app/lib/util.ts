/**
 * Formats a file size in bytes into a human-readable string.
 * @param bytes - The size in bytes.
 * @returns A formatted string (e.g. "1.5 KB", "3.2 MB", "1.0 GB").
 */
export function formatSize(bytes: number): string {
  if (bytes < 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  let unitIndex = 0;
  let size = bytes;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return unitIndex === 0
    ? `${size} ${units[unitIndex]}`
    : `${size.toFixed(2)} ${units[unitIndex]}`;
}

export const generateUUID = () => crypto.randomUUID();