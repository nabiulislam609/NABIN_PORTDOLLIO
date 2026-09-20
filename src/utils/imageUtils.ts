/**
 * Reads a local file from the user's desktop, optionally resizing/compressing it
 * so it can be stored reliably in local storage / sent over API without exceeding quotas.
 */
export function processImageFile(
  file: File,
  maxDimension = 1400,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Selected file is not an image.'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image.'));
      img.onload = () => {
        try {
          let { width, height } = img;

          // If image is already smaller than maxDimension, check if SVG or small enough
          if (file.type === 'image/svg+xml' || (width <= maxDimension && height <= maxDimension && file.size < 600 * 1024)) {
            resolve(reader.result as string);
            return;
          }

          if (width > maxDimension || height > maxDimension) {
            if (width > height) {
              height = Math.round((height * maxDimension) / width);
              width = maxDimension;
            } else {
              width = Math.round((width * maxDimension) / height);
              height = maxDimension;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(reader.result as string);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          // Export as web-friendly jpeg or png
          const outputType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const dataUrl = canvas.toDataURL(outputType, quality);
          resolve(dataUrl);
        } catch {
          // Fallback to raw base64 if canvas operation fails
          resolve(reader.result as string);
        }
      };

      img.src = reader.result as string;
    };

    reader.readAsDataURL(file);
  });
}
