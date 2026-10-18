import React, { useRef, useState } from 'react';
import { Camera, Upload, X, CheckCircle, Video } from 'lucide-react';

export interface PhotoItem {
  id: string;
  file?: File;
  previewUrl: string;
  name: string;
}

interface ImageUploaderProps {
  photos: PhotoItem[];
  onPhotosChange: (photos: PhotoItem[]) => void;
  maxPhotos?: number;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  photos, 
  onPhotosChange,
  maxPhotos = 5 
}) => {
  const [cameraModalOpen, setCameraModalOpen] = useState(false);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file import / selection
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      alert(`Maximum of ${maxPhotos} photos allowed.`);
      return;
    }

    const selectedFiles = Array.from(e.target.files).slice(0, remainingSlots);
    const newItems: PhotoItem[] = selectedFiles.map((file) => ({
      id: 'photo_' + Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));

    onPhotosChange([...photos, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!e.dataTransfer.files) return;

    const remainingSlots = maxPhotos - photos.length;
    if (remainingSlots <= 0) {
      alert(`Maximum of ${maxPhotos} photos allowed.`);
      return;
    }

    const droppedFiles = Array.from(e.dataTransfer.files)
      .filter((file) => file.type.startsWith('image/'))
      .slice(0, remainingSlots);

    const newItems: PhotoItem[] = droppedFiles.map((file) => ({
      id: 'photo_' + Math.random().toString(36).substring(2, 9),
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));

    onPhotosChange([...photos, ...newItems]);
  };

  // Start Web Camera
  const startCamera = async () => {
    if (photos.length >= maxPhotos) {
      alert(`Maximum of ${maxPhotos} photos allowed.`);
      return;
    }

    setCameraModalOpen(true);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.warn('Camera access denied or unavailable:', err);
      alert('Could not access your camera. Please use the Browse Files option to import photos.');
      setCameraModalOpen(false);
    }
  };

  // Snap photo from Web Camera
  const capturePhoto = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture_${Date.now()}.jpg`, { type: 'image/jpeg' });
        const newPhoto: PhotoItem = {
          id: 'photo_' + Date.now(),
          file,
          previewUrl: URL.createObjectURL(blob),
          name: `Camera photo ${photos.length + 1}`,
        };
        onPhotosChange([...photos, newPhoto]);
      }
    }, 'image/jpeg', 0.9);

    closeCamera();
  };

  const closeCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    setCameraModalOpen(false);
  };

  const removePhoto = (id: string) => {
    onPhotosChange(photos.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Unified Single Upload Dropzone & Action Box */}
      {photos.length < maxPhotos && (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-primary/30 hover:border-primary bg-primary-soft/30 hover:bg-primary-soft/60 rounded-3xl p-8 sm:p-10 text-center transition-all flex flex-col items-center justify-center group"
        >
          <div className="w-16 h-16 rounded-2xl bg-white border border-border-light shadow-sm flex items-center justify-center text-primary group-hover:scale-105 transition-transform mb-4">
            <Upload size={28} />
          </div>

          <h3 className="font-extrabold text-base sm:text-lg text-text-primary mb-1">
            Upload Property Photos
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary max-w-sm mb-6">
            Drag and drop images here, or choose an option below. (Up to {maxPhotos} photos)
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-3 bg-primary text-white rounded-2xl font-bold text-xs sm:text-sm shadow-md hover:bg-primary-hover active:scale-95 transition-all flex items-center gap-2"
            >
              <Upload size={16} />
              <span>Browse Files</span>
            </button>

            <button
              type="button"
              onClick={startCamera}
              className="px-5 py-3 bg-white border-2 border-border-light text-text-primary rounded-2xl font-bold text-xs sm:text-sm hover:border-primary/40 active:scale-95 transition-all flex items-center gap-2 shadow-xs"
            >
              <Video size={16} className="text-primary" />
              <span>Take Photo</span>
            </button>
          </div>

          <p className="text-[11px] text-text-muted mt-4">
            Accepted formats: JPG, PNG, WEBP (Max 25MB each)
          </p>
        </div>
      )}

      {/* Uploaded Photos Gallery Preview */}
      {photos.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CheckCircle size={18} className="text-emerald-500" />
              <h4 className="text-sm font-bold text-text-primary">
                Selected Photos ({photos.length}/{maxPhotos})
              </h4>
            </div>
            {photos.length < maxPhotos && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-primary hover:underline"
              >
                + Add More
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {photos.map((item, index) => (
              <div
                key={item.id}
                className="group relative rounded-2xl overflow-hidden border-2 border-border-light bg-white shadow-sm aspect-video flex items-center justify-center"
              >
                <img
                  src={item.previewUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Photo sequence badge */}
                <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/60 text-white rounded-md text-[10px] font-bold">
                  Photo {index + 1}
                </span>

                {/* Delete button */}
                <button
                  type="button"
                  onClick={() => removePhoto(item.id)}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 hover:bg-red-500 text-white flex items-center justify-center transition-all shadow active:scale-95"
                  title="Remove photo"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Live Web Camera Modal */}
      {cameraModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-border-light">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
                <h4 className="font-bold text-text-primary text-sm">
                  Live Camera
                </h4>
              </div>
              <button
                type="button"
                onClick={closeCamera}
                className="w-8 h-8 rounded-full bg-background-main flex items-center justify-center text-text-secondary hover:text-text-primary"
              >
                <X size={18} />
              </button>
            </div>

            {/* Video Viewfinder */}
            <div className="relative bg-black aspect-video flex items-center justify-center overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                onLoadedMetadata={() => videoRef.current?.play()}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Modal Footer Controls */}
            <div className="p-4 bg-background-card flex items-center justify-between">
              <button
                type="button"
                onClick={closeCamera}
                className="px-4 py-2 text-xs font-bold text-text-secondary hover:text-text-primary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={capturePhoto}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-primary-hover active:scale-95 transition-all"
              >
                <Camera size={18} />
                <span>Snap Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
