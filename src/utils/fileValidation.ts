export const MAX_BROWSER_FILE_SIZE = 100 * 1024 * 1024; // 100 MB
export const WARN_LARGE_FILE_SIZE = 35 * 1024 * 1024; // 35 MB

export interface FileValidationResult {
  valid: boolean;
  error?: string;
  warning?: string;
  detectedType?: string;
}

/**
 * Validates file size and magic bytes
 */
export async function validateInputFile(
  file: File,
  expectedType: 'pdf' | 'image' | 'word' | 'excel' | 'text' | 'any' = 'pdf',
  maxBytes: number = MAX_BROWSER_FILE_SIZE
): Promise<FileValidationResult> {
  // Check empty file
  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty (0 bytes).' };
  }

  // Check file size limit
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `File size (${(file.size / (1024 * 1024)).toFixed(1)} MB) exceeds browser safety limit of ${(maxBytes / (1024 * 1024)).toFixed(0)} MB.`,
    };
  }

  let warning: string | undefined;
  if (file.size > WARN_LARGE_FILE_SIZE) {
    warning = `Large file (${(file.size / (1024 * 1024)).toFixed(1)} MB) may require more browser memory and take longer to process.`;
  }

  // Read first 16 bytes for magic bytes validation
  try {
    const slice = file.slice(0, 16);
    const buffer = await slice.arrayBuffer();
    const bytes = new Uint8Array(buffer);

    // PDF Magic bytes: %PDF (0x25 0x50 0x44 0x46)
    const isPdf = bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46;

    // JPEG: 0xFF 0xD8 0xFF
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;

    // PNG: 0x89 0x50 0x4E 0x47
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;

    // WEBP: RIFF....WEBP (bytes 0-3 = 'RIFF', 8-11 = 'WEBP')
    const isRiff = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46;
    const isWebp = isRiff && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

    // ZIP (including docx / xlsx / pptx): PK.. (0x50 0x4B 0x03 0x04)
    const isZip = bytes[0] === 0x50 && bytes[1] === 0x4b;

    let detectedType = 'unknown';
    if (isPdf) detectedType = 'pdf';
    else if (isJpeg || isPng || isWebp) detectedType = 'image';
    else if (isZip) detectedType = 'archive_or_office';

    if (expectedType === 'pdf' && !isPdf) {
      return {
        valid: false,
        error: `"${file.name}" does not appear to be a valid PDF document (missing %PDF signature header).`,
      };
    }

    if (expectedType === 'image' && !isJpeg && !isPng && !isWebp) {
      return {
        valid: false,
        error: `"${file.name}" is not a recognized JPG, PNG, or WEBP image.`,
      };
    }

    if (expectedType === 'word' && !file.name.toLowerCase().endsWith('.docx') && !isZip) {
      return {
        valid: false,
        error: `"${file.name}" is not a valid Microsoft Word (.docx) document.`,
      };
    }

    if (expectedType === 'excel' && !file.name.toLowerCase().match(/\.(xlsx|xls|csv)$/) && !isZip) {
      return {
        valid: false,
        error: `"${file.name}" is not a valid Excel (.xlsx, .xls, .csv) document.`,
      };
    }

    return { valid: true, warning, detectedType };
  } catch (err: any) {
    return { valid: false, error: `Could not read file header: ${err.message || err}` };
  }
}

/**
 * Sanitizes a file name for safe download
 */
export function sanitizeFileName(name: string, fallback: string = 'document'): string {
  const sanitized = name.replace(/[^a-zA-Z0-9._-]/g, '_').trim();
  return sanitized.length > 0 ? sanitized : fallback;
}
