import { useEffect, useRef, useState } from "react";
import { Camera, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface CameraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64: string) => void;
}

export default function CameraModal({ isOpen, onClose, onCapture }: CameraModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    try {
      setCameraError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1080 },
          height: { ideal: 1920 }, // Try vertical/portrait capture
        },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch {
      setCameraError("Camera access was denied or is unavailable on this device.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const video = videoRef.current;
      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 1280;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Mirror the image for intuitive user self-capturing
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
        onCapture(dataUrl);
        onClose();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-panel border border-line rounded-none shadow-2xl overflow-hidden flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-line">
            <span className="font-serif-playfair tracking-wider text-sm font-medium text-text-main uppercase">
              STUDIO WEBCAM PORTRAIT
            </span>
            <button
              onClick={onClose}
              className="p-1 text-muted hover:text-text-main transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Viewport */}
          <div className="relative aspect-[3/4] w-full bg-bg flex items-center justify-center">
            {cameraError ? (
              <div className="p-8 text-center space-y-4">
                <p className="text-sm text-red-400 font-light">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-bg/10 hover:bg-bg/20 border border-line text-xs tracking-widest uppercase transition rounded-none"
                >
                  Retry Camera Load
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 w-full h-full object-cover scale-x-[-1]"
                />
                
                {/* Modern lookbook overlay box */}
                <div className="absolute inset-8 border border-white/20 pointer-events-none flex flex-col justify-between p-4">
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-t-2 border-l-2 border-white/60" />
                    <div className="w-4 h-4 border-t-2 border-r-2 border-white/60" />
                  </div>
                  {/* Portrait guide silhouette (chest/face helper) */}
                  <div className="w-40 h-40 border border-dashed border-white/10 rounded-full mx-auto self-center flex items-center justify-center opacity-30">
                    <span className="text-[9px] uppercase tracking-widest text-white">Align Face Here</span>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-4 h-4 border-b-2 border-l-2 border-white/60" />
                    <div className="w-4 h-4 border-b-2 border-r-2 border-white/60" />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Controls */}
          <div className="p-6 bg-panel border-t border-line flex justify-center space-x-4">
            <button
              onClick={capturePhoto}
              disabled={!!cameraError || !stream}
              className="px-6 py-3 bg-text-main text-bg hover:bg-text-main/90 disabled:bg-bg/30 disabled:text-muted font-medium text-xs tracking-widest uppercase transition flex items-center space-x-2 rounded-none cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              <span>Capture Look</span>
            </button>
            <button
              onClick={startCamera}
              className="p-3 bg-bg/5 hover:bg-bg/10 border border-line text-text-main transition rounded-none"
              title="Refresh Camera"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
