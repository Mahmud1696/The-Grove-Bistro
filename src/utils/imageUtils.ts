/**
 * Utility functions for handling and optimizing uploaded dish images.
 */

export interface ProcessedImageResult {
  dataUrl: string;
  fileName: string;
  fileSizeFormatted: string;
  width: number;
  height: number;
}

/**
 * Reads an image file from the device, resizes it to max dimensions
 * (max 1200x900) while maintaining aspect ratio, and compresses it to JPEG
 * with 0.85 quality. This yields a crisp, high-resolution retina photo
 * while keeping file weight under ~120KB for instantaneous website loading
 * and reliable local persistence.
 */
export function processDishImageFile(file: File): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please select a valid image file (JPG, PNG, WebP).'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read image file from device.'));
    reader.onload = (event) => {
      const rawDataUrl = event.target?.result as string;
      const img = new Image();
      img.onerror = () => reject(new Error('Unable to decode the selected image file.'));
      img.onload = () => {
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 900;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width / height > MAX_WIDTH / MAX_HEIGHT) {
            height = Math.round((height * MAX_WIDTH) / width);
            width = MAX_WIDTH;
          } else {
            width = Math.round((width * MAX_HEIGHT) / height);
            height = MAX_HEIGHT;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          const approxKb = Math.round((rawDataUrl.length * 3) / 4 / 1024);
          resolve({
            dataUrl: rawDataUrl,
            fileName: file.name,
            fileSizeFormatted: approxKb > 1024 ? `${(approxKb / 1024).toFixed(1)} MB` : `${approxKb} KB`,
            width: img.width,
            height: img.height
          });
          return;
        }

        // Fill white background for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        const approxKb = Math.round((optimizedDataUrl.length * 3) / 4 / 1024);

        resolve({
          dataUrl: optimizedDataUrl,
          fileName: file.name,
          fileSizeFormatted: approxKb > 1024 ? `${(approxKb / 1024).toFixed(1)} MB` : `${approxKb} KB`,
          width,
          height
        });
      };
      img.src = rawDataUrl;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Curated high-res culinary sample photos in case manager wants to test
 * or pick a curated template if no photo is readily available on their current device.
 */
export const SAMPLE_DISH_PHOTOS = [
  {
    name: 'Wagyu Ribeye Steak',
    url: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    category: 'steaks'
  },
  {
    name: 'Black Truffle Tagliatelle',
    url: 'https://images.unsplash.com/photo-1608897013039-887f21d8c804?auto=format&fit=crop&w=800&q=80',
    category: 'pasta'
  },
  {
    name: 'Pan-Seared Chilean Sea Bass',
    url: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?auto=format&fit=crop&w=800&q=80',
    category: 'mains'
  },
  {
    name: 'Heirloom Burrata Salad',
    url: 'https://images.unsplash.com/photo-1592417817098-8f3d69102a5c?auto=format&fit=crop&w=800&q=80',
    category: 'starters'
  },
  {
    name: 'Belgian Chocolate Fondant',
    url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    category: 'desserts'
  },
  {
    name: 'Artisan Smoked Mocktail',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    category: 'beverages'
  }
];
