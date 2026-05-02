import { Image as ImageIcon, FileText } from 'lucide-react';

export function getFilePreviewIcon(file) {
  if (file.type.startsWith('image/')) return ImageIcon;
  return FileText;
}