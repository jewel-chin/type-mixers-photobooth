import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import TypeMixersLogo from "../assets/type_logo.png";
import countDown_3 from "../assets/countdown_3.png";
import countDown_2 from "../assets/countdown_2.png";
import countDown_1 from "../assets/countdown_1.png";
import { generateQrForStrip, playBeep, playShutter } from "../helpers/helpers";
import Sketch from "@uiw/react-color-sketch";
import { PixelsImage } from "react-pixels";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const MAX_CAPTURES = 4;
const COUNTER = 3;
const countdownImages: { [key: number]: string } = {
  3: countDown_3,
  2: countDown_2,
  1: countDown_1,
};

const filters = {
  none: "none",
  greyscale: "greyscale",
};

const PhotoBooth: React.FC = () => {
  const stripRef = useRef(null);
  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentCount, setCurrentCount] = useState(COUNTER);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [photoStripBgColor, setPhotoStripBgColor] =
    useState("--color-dark-brown");
  const [filter, setFilter] = useState<keyof typeof filters>("none");
  const [isGeneratingQr, setIsGeneratingQr] = useState(false);
  const [customText, setCustomText] = useState("");
  const [textColor, setTextColor] = useState<"black" | "white">("white");
  const [showDate, setShowDate] = useState(true);

  const startCaptureSequence = () => {
    setIsStarted(true);

    const runSequence = async () => {
      const takePhoto = () => {
        if (webcamRef.current) {
          const src = webcamRef.current.getScreenshot();
          setCapturedImages((prev) => [...prev, src!]);
        }
      };

      for (let i = 0; i < MAX_CAPTURES; i++) {
        let count = COUNTER;
        while (count >= 0) {
          setCurrentCount(count);
          if (count > 0) {
            playBeep();
          }
          await new Promise((res) => setTimeout(res, 1000));
          count -= 1;
        }
        playShutter();
        takePhoto();
        await new Promise((res) => setTimeout(res, 500));
      }
    };

    runSequence();
  };

  const generateQrCode = async () => {
    setIsGeneratingQr(true);
    await generateQrForStrip({ stripRef, setQrCode });

    // tee hee fake timer
    setTimeout(() => {
      setIsGeneratingQr(false);
    }, 1500);
  };

  const todayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const isInitialScreen = !isStarted && capturedImages.length === 0;

  // Show webcam only at the start or during the countdown
  const showWebcam =
    isInitialScreen || (isStarted && capturedImages.length < MAX_CAPTURES);

  const restartPhotobooth = () => {
    // reset all states
    setCapturedImages([]);
    setIsStarted(false);
    setCurrentCount(COUNTER);
    setQrCode(null);
    setPhotoStripBgColor("--color-dark-brown");
    setFilter("none");
    setCustomText("");
    setTextColor("white");
    setShowDate(true);
  };

  return (
    <div className="min-h-screen w-full p-4 flex flex-col items-center justify-center gap-8 overflow-y-auto">
      <div
        className={`flex w-full h-full items-center justify-center gap-8 ${
          // 1. if strip is shown (!showWebcam), use flex-row even on mobile
          // 2. Otherwise (initial/taking photos), use flex-col on mobile and flex-row on desktop (lg)
          !showWebcam ? "flex-row" : "flex-col lg:flex-row"
        }`}
      >
        {/* LEFT – Webcam (50%) */}
        <div className="lg:w-1/2 w-full flex justify-center items-center">
          {showWebcam ? (
            <Webcam
              audio={false}
              ref={webcamRef}
              mirrored
              screenshotFormat="image/jpeg"
              videoConstraints={videoConstraints}
              className="w-full h-auto max-w-full"
            />
          ) : (
            // photo strip configurator
            <div className="flex flex-col items-center gap-4">
              <span>Customize Your Photo Strip:</span>
              <div className="flex lg:flex-row items-start gap-4 flex-col">
                <div className="flex flex-row gap-2">
                  <Sketch
                    color={photoStripBgColor}
                    presetColors={[
                      "#392d28",
                      "#e8d3b8",
                      "#bc9c74",
                      "#7c6f64",
                      "#6F0707",
                    ]}
                    width={200}
                    disableAlpha={true}
                    onChange={(color) => {
                      setPhotoStripBgColor(color.hex);
                    }}
                  />
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-row gap-2">
                    <label className="text-sm mr-2 self-center">Filters:</label>
                    {Object.keys(filters).map((key) => (
                      <button
                        key={key}
                        onClick={() => setFilter(key as keyof typeof filters)}
                        className={`
                          ${
                            filter === key ? "base-button" : "unselected-button"
                          }`}
                      >
                        {key}
                      </button>
                    ))}
                  </div>

                  {/* CUSTOM TEXT SECTION */}
                  <div className="flex flex-col gap-2 p-3 bg-[#7c6f64]/50 rounded-md">
                    <label className="text-sm">Add Message:</label>
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Type here..."
                      className="text-[0.7em] bg-cream text-dark-brown p-1 text-sm rounded border border-gray-600"
                    />
                    <div className="flex gap-2 mt-1">
                      <button
                        onClick={() => setTextColor("white")}
                        className={`text-sm ${
                          textColor === "white"
                            ? "base-button"
                            : "unselected-button"
                        }`}
                      >
                        White Text
                      </button>
                      <button
                        onClick={() => setTextColor("black")}
                        className={`text-sm ${
                          textColor === "black"
                            ? "base-button"
                            : "unselected-button"
                        }`}
                      >
                        Black Text
                      </button>
                    </div>
                    <button
                      className="unselected-button"
                      onClick={() => setShowDate(!showDate)}
                    >
                      {showDate ? "Hide Date" : "Show Date"}
                    </button>
                  </div>

                  <div className="flex flex-row items-center gap-2">
                    <button
                      onClick={() => generateQrCode()}
                      className={`base-button`}
                    >
                      Generate QR Code
                    </button>
                    {isGeneratingQr && (
                      <div className="w-5 h-5 border-2 border-t-transparent border-dark-brown rounded-full animate-spin" />
                    )}
                  </div>
                  <div className="flex flex-row items-center gap-4">
                    {!isGeneratingQr && qrCode && (
                      <div className="flex flex-col items-start">
                        <button className="text-xs italic text-red-900 text-start">
                          Scan to get your photo strip! Expires in 2 minutes.{" "}
                          <br /> Remember to save :)
                        </button>
                        <img
                          src={qrCode || ""}
                          alt="QR Code for Photo Booth Strip"
                          className="w-30"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT – Start screen (50%) */}
        <div className="lg:w-1/2 w-full mt-10 lg:mt-0 flex items-center justify-center">
          {isInitialScreen && (
            <div className="text-center flex flex-col items-center">
              <img
                src={TypeMixersLogo}
                alt="type mixers logo"
                className="w-48"
              />
              <span className="text-xs italic mb-4">
                Type Mixers Photo Booth
              </span>
              <button onClick={startCaptureSequence} className="base-button">
                Start
              </button>
            </div>
          )}

          {capturedImages.length > 0 && (
            <div
              ref={stripRef}
              className="custom-photobooth-strip flex flex-col items-center"
              style={{
                backgroundColor: photoStripBgColor,
                maxWidth: "24vw",
              }}
            >
              {capturedImages.map((imgSrc, index) => (
                <PixelsImage
                  key={index}
                  src={imgSrc}
                  style={{ width: "20vw" }}
                  filter={filter}
                />
              ))}

              <img
                src={TypeMixersLogo}
                alt="type mixers logo"
                className="w-32 pt-4 pb-2"
              />

              <div
                className="flex flex-col items-center px-4 pb-4"
                style={{ width: "20vw" }} // Matches image width exactly
              >
                <span
                  className={`text-[0.7em] tracking-tight italic text-center leading-tight break-word w-full ${
                    textColor === "white" ? "text-white" : "text-black"
                  }`}
                  style={{
                    overflowWrap: "anywhere",
                  }}
                >
                  {customText}
                </span>

                {showDate && (
                  <span
                    className={`text-[0.6em] tracking-tight italic mt-1 ${
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
      {!showWebcam && (
        <button
          className="fixed bottom-0 left-0 m-4 mb-4 back-button"
          onClick={() => restartPhotobooth()}
        >
          ← Go Back
        </button>
      )}
      <div className="fixed left-4 bottom-4 z-50">
        {isStarted && currentCount > 0 && (
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
            <img
              src={countdownImages[currentCount]}
              alt={`Countdown ${currentCount}`}
              className="scale-50"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoBooth;
