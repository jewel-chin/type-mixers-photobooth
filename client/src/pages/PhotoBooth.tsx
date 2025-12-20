import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import TypeMixersLogo from "../assets/type_logo.png";
import countDown_3 from "../assets/countdown_3.png";
import countDown_2 from "../assets/countdown_2.png";
import countDown_1 from "../assets/countdown_1.png";
import { generateQrForStrip, startCaptureSequence } from "../helpers/helpers";
import { PixelsImage } from "react-pixels";
import { PhotoStripConfigurator } from "../components/PhotoStripConfigurator";
import { filters, COUNT_STARTER, MAX_CAPTURES } from "../constants/const";
import { GetStarted } from "../components/GetStarted";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const countdownImages: { [key: number]: string } = {
  3: countDown_3,
  2: countDown_2,
  1: countDown_1,
};

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
            videoConstraints={videoConstraints}
            className="w-full h-auto max-w-full"
            style={{
              filter: filter === "greyscale" ? "contrast(130%)" : "none",
            }}
          />

          {/* Countdown Overlay */}
          {currentCount > 0 && (
            <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-50">
              <img
                src={countdownImages[currentCount]}
                alt={`Countdown ${currentCount}`}
                className="scale-25 animate-bounce"
              />
            </div>
          )}
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
                videoConstraints={videoConstraints}
                className="w-full h-auto max-w-full"
              />
            ) : (
              <PhotoStripConfigurator
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
              <div
                ref={stripRef}
                className="custom-photobooth-strip scale-80"
                style={{
                  backgroundColor: photoStripBgColor,
                }}
              >
                {capturedImages.map((imgSrc, index) => (
                  <PixelsImage
                    key={index}
                    src={imgSrc}
                    style={{
                      filter:
                        filter === "greyscale" ? "contrast(130%)" : "none",
                    }}
                    filter={filter}
                    className="w-[250px] mb-2"
                  />
                ))}
                <img
                  src={TypeMixersLogo}
                  alt="logo"
                  className="w-24 pt-4 pb-2"
                />
                <div className="flex flex-col items-center px-4 pb-4 w-[250px]">
                  <span
                    className={`text-sm italic text-center leading-tight break-words w-full ${
                      textColor === "white" ? "text-white" : "text-black"
                    }`}
                  >
                    {customText}
                  </span>
                  {showDate && (
                    <span
                      className={`text-xs italic mt-2 ${
                        textColor === "white" ? "text-white" : "text-black"
                      }`}
                    >
                      {todayDate}
                    </span>
                  )}
                </div>
              </div>
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
