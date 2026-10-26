export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (!bytes || isNaN(bytes)) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  if (i >= sizes.length) return `${(bytes / Math.pow(k, sizes.length - 1)).toFixed(1)} ${sizes[sizes.length - 1]}`;
  
  const formatted = (bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1);
  return `${formatted} ${sizes[i]}`;
}
