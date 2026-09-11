import { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryLightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function GalleryLightbox({
  items,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext
}: GalleryLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex] || items[0];

  return (
    <div
      id="gallery-lightbox-modal"
      className="fixed inset-0 z-50 bg-[#121613]/95 backdrop-blur-md flex flex-col justify-between text-white p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label="Gallery Image Viewer"
    >
      {/* Top Header with Image Counter & Close */}
      <div className="flex items-center justify-between max-w-6xl mx-auto w-full">
        <div className="text-xs uppercase tracking-[0.2em] text-[#C0CBC2]">
          <span>{currentIndex + 1}</span> / <span>{items.length}</span> — {currentItem.category}
        </div>
        <button
          id="close-lightbox-btn"
          onClick={onClose}
          aria-label="Close Lightbox"
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image View & Navigation */}
      <div className="relative flex-1 flex items-center justify-center max-w-5xl mx-auto w-full my-4">
        {/* Prev Button */}
        <button
          id="lightbox-prev-btn"
          onClick={onPrev}
          aria-label="Previous Image"
          className="absolute left-2 sm:left-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image Display */}
        <div className="relative max-h-[75vh] max-w-full overflow-hidden flex flex-col items-center">
          <img
            src={currentItem.imageUrl}
            alt={currentItem.title}
            className="max-h-[70vh] w-auto max-w-full object-contain rounded-sm shadow-2xl transition-transform duration-300"
          />
        </div>

        {/* Next Button */}
        <button
          id="lightbox-next-btn"
          onClick={onNext}
          aria-label="Next Image"
          className="absolute right-2 sm:right-4 z-10 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-xs transition-colors cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Bottom Caption */}
      <div className="text-center max-w-2xl mx-auto w-full pb-2">
        <h3 className="font-serif-display text-lg sm:text-xl font-normal text-white">
          {currentItem.title}
        </h3>
        {currentItem.caption && (
          <p className="font-sans-ui text-xs sm:text-sm text-[#AAB5AC] font-light mt-1">
            {currentItem.caption}
          </p>
        )}
      </div>
    </div>
  );
}
