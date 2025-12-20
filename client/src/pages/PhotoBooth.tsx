import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import { generateQrForStrip } from "../helpers/helpers";
import { PhotoStripConfigurator } from "../components/PhotoStripConfigurator";
import {
  filters,
  COUNT_STARTER,
  MAX_CAPTURES,
  COUNTDOWN_IMAGE_URLS,
  VIDEO_CONSTRAINTS,
} from "../constants/const";
import { GetStarted } from "../components/GetStarted";
import { PhotoStrip } from "../components/PhotoStrip";
import { CameraFlash } from "../components/CameraFlash";

const PhotoBooth: React.FC = () => {
  const stripRef = useRef(null);
  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentCount, setCurrentCount] = useState(COUNT_STARTER);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [photoStripBgColor, setPhotoStripBgColor] =
    useState("--color-dark-brown");
  const [filter, setFilter] = useState<keyof typeof filters>("none");
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState<"black" | "white">("white");
  const [showDate, setShowDate] = useState(true);
  const [fontFamily, setFontFamily] = useState("'Inter', sans-serif");

  const isInitialScreen = !isStarted && capturedImages.length === 0;
  const isCapturing = isStarted && capturedImages.length < MAX_CAPTURES;
  const isFinished = capturedImages.length === MAX_CAPTURES;

  const generateQrCode = async () => {
    setIsGeneratingQr(true);
    await generateQrForStrip({ stripRef, setQrCode });
    setIsGeneratingQr(false);
  };

  const restartPhotobooth = () => {
    setCapturedImages([]);
    setIsStarted(false);
    setCurrentCount(COUNT_STARTER);
    setQrCode(null);
    setPhotoStripBgColor("--color-dark-brown");
    setFilter("none");
    setCustomText("");
    setTextColor("white");
    setShowDate(true);
  };

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen w-full p-4 flex flex-col items-center justify-center bg-background">
      {/* 1. CAPTURING STATE (Webcam only, full screen) */}
      {isCapturing && (
        <div className="w-full flex flex-col items-center justify-center animate-in fade-in duration-500">
          <Webcam
            audio={false}
            ref={webcamRef}
            mirrored
            screenshotFormat="image/jpeg"
            videoConstraints={VIDEO_CONSTRAINTS}
            className="w-full h-auto max-w-full"
            style={{
              filter: filter === "greyscale" ? "contrast(130%)" : "none",
            }}
          />

          {/* Countdown Overlay */}
          {currentCount > 0 && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <img
                src={COUNTDOWN_IMAGE_URLS[currentCount]}
                alt={`Countdown ${currentCount}`}
                className="scale-25 animate-bounce"
              />
            </div>
          )}
          {
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <CameraFlash isFlashing={currentCount == 0} />
            </div>
          }
        </div>
      )}

      {/* 2. INITIAL OR FINISHED STATE (Split Screen) */}
      {!isCapturing && (
        <div className="flex flex-col lg:flex-row w-full max-w-6xl items-center justify-center gap-12">
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-1/2 flex justify-center">
            {isInitialScreen ? (
              <Webcam
                audio={false}
                ref={webcamRef}
                mirrored
                screenshotFormat="image/jpeg"
                videoConstraints={VIDEO_CONSTRAINTS}
                className="w-full h-auto max-w-full"
              />
            ) : (
              <PhotoStripConfigurator
                stripRef={stripRef}
                photoStripBgColor={photoStripBgColor}
                setPhotoStripBgColor={setPhotoStripBgColor}
                filter={filter}
                setFilter={setFilter}
                customText={customText}
                setCustomText={setCustomText}
                textColor={textColor}
                setTextColor={setTextColor}
                showDate={showDate}
                setShowDate={setShowDate}
                generateQrCode={generateQrCode}
                isGeneratingQr={isGeneratingQr}
                qrCode={qrCode}
                fontFamily={fontFamily}
                setFontFamily={setFontFamily}
              />
            )}
          </div>

          {/* RIGHT COLUMN */}
          <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
            {isInitialScreen ? (
              <GetStarted
                setIsStarted={setIsStarted}
                webcamRef={webcamRef}
                setCapturedImages={setCapturedImages}
                setCurrentCount={setCurrentCount}
              />
            ) : (
              /* THE PHOTO STRIP */
              <PhotoStrip
                stripRef={stripRef}
                capturedImages={capturedImages}
                photoStripBgColor={photoStripBgColor}
                filter={filter}
                customText={customText}
                textColor={textColor}
                showDate={showDate}
                todayDate={todayDate}
                fontFamily={fontFamily}
              />
            )}
          </div>
        </div>
      )}

      {/* Back Button */}
      {isFinished && (
        <button
          className="fixed bottom-8 left-8 back-button"
          onClick={restartPhotobooth}
        >
          ← Go Back
        </button>
      )}
    </div>
  );
};

export default PhotoBooth;
