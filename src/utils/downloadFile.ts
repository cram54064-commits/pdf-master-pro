import JSZip from 'jszip';
import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#4F46E5', '#7C3AED', '#2563EB', '#10B981'],
    });
  } catch {
    // Ignore if canvas isn't available
  }
}

/**
 * Triggers a download of a Blob or Uint8Array with proper filename and revokes object URL
 */
export function downloadFile(
  data: Blob | Uint8Array | ArrayBuffer | string,
  fileName: string,
  mimeType: string = 'application/pdf'
) {
  let blob: Blob;

  if (typeof data === 'string') {
    blob = new Blob([data], { type: mimeType });
  } else if (data instanceof Blob) {
    blob = data;
  } else {
    blob = new Blob([data as any], { type: mimeType });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();

  // Auto clean up object URL after download trigger
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 2000);

  fireCelebrationConfetti();
}

/**
 * Packages multiple files into a ZIP archive and triggers download
 */
export async function downloadZip(
  files: { name: string; data: Uint8Array | Blob | string }[],
  zipFileName: string = 'PDF_Master_Pro_Package.zip',
  onProgress?: (percent: number) => void
) {
  const zip = new JSZip();

  for (const file of files) {
    zip.file(file.name, file.data);
  }

  const content = await zip.generateAsync(
    { type: 'blob', compression: 'DEFLATE', compressionOptions: { level: 6 } },
    (metadata) => {
      if (onProgress) onProgress(Math.round(metadata.percent));
    }
  );

  downloadFile(content, zipFileName, 'application/zip');
}
