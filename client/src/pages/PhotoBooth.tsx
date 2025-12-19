import React, { useRef, useState } from "react";
import Webcam from "react-webcam";
import TypeMixersLogo from "../assets/type_logo.png";
import { generateQrForStrip } from "../helpers/helpers";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

const MAX_CAPTURES = 4;
const COUNTER = 3;

const PhotoBooth: React.FC = () => {
  const stripRef = useRef(null);
  const webcamRef = useRef<Webcam>(null);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [isStarted, setIsStarted] = useState(false);
  const [currentCount, setCurrentCount] = useState(COUNTER);
  const [qrCode, setQrCode] = useState<string | null>(null);

  //   const capture = useCallback(() => {
  //     if (webcamRef.current) {
  //       const imageSrc = webcamRef.current.getScreenshot();
  //       setCapturedImages([...capturedImages, imageSrc!]);
  //     }
  //   }, [webcamRef, setCapturedImages]);

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
          await new Promise((res) => setTimeout(res, 1000));
          count -= 1;
        }

        takePhoto();
        // small pause before next countdown (optional)
        // eslint-disable-next-line no-await-in-loop
        await new Promise((res) => setTimeout(res, 500));
      }

      // finished sequence
      setIsStarted(false);
      generateQrForStrip({ stripRef, setQrCode });

      setCurrentCount(COUNTER);
    };

    runSequence();
  };

  const download = async () => {
    if (!stripRef.current) return;

    generateQrForStrip({ stripRef, setQrCode });
    setCapturedImages([]);
    setCurrentCount(COUNTER);
    setIsStarted(false);
  };

  const isInitialScreen =
    !isStarted && currentCount === 3 && capturedImages.length === 0;
  return (
    <div className="min-h-screen min-w-screen p-4 flex flex-row items-center justify-between">
      <div className="flex flex-row gap-2 items-center justify-between w-full">
        <Webcam
          audio={false}
          height={360}
          ref={webcamRef}
          mirrored={true}
          screenshotFormat="image/jpeg"
          width={640}
          videoConstraints={videoConstraints}
        />
        {isInitialScreen && (
          <div className="text-center flex flex-col items-center justify-center w-full">
            <img src={TypeMixersLogo} alt="type mixers logo" className="w-48" />
            <span className="text-xs italic mb-4">Type Mixers Photo Booth</span>
            <button
              onClick={startCaptureSequence}
              className="bg-dark-brown text-cream py-1 px-4 rounded hover:bg-red-900 transition-colors duration-300"
            >
              Start
            </button>
          </div>
        )}
      </div>

      {capturedImages.length > 0 && (
        <div className="text-center flex flex-col items-center justify-center w-full">
          <div ref={stripRef} className="custom-photobooth-strip">
            {capturedImages.map((imgSrc, index) => (
              <img
                key={index}
                src={imgSrc}
                alt={`Capture ${index + 1}`}
                style={{ width: "20vw" }}
              />
            ))}
            <img
              src={TypeMixersLogo}
              alt="type mixers logo"
              className="w-30 py-4"
            />
          </div>
        </div>
      )}

      <div className="fixed left-4 bottom-4 z-50">
        {isStarted && currentCount > 0 && (
          <div className="text-9xl">{currentCount}</div>
        )}

        {qrCode && (
          <div className="flex flex-col items-center justify-center">
            <button className="text-xs" onClick={download}>
              Scan to get your photo strip:
            </button>
            <img
              src={qrCode}
              alt="QR Code for Photo Booth Strip"
              className="w-30"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PhotoBooth;
