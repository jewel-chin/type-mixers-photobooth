import React from "react";
import Webcam from "react-webcam";
import TypeMixersLogo from "../assets/type_logo.png";
import heart from "../assets/heart.png";
import { startCaptureSequence } from "../helpers/helpers";

type Props = {
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
  webcamRef: React.RefObject<Webcam | null>;
  setCapturedImages: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentCount: React.Dispatch<React.SetStateAction<number>>;
};

export const GetStarted = ({
  setIsStarted,
  webcamRef,
  setCapturedImages,
  setCurrentCount,
}: Props) => {
  return (
    <div className="text-center flex flex-col items-center">
      <img src={TypeMixersLogo} alt="type mixers logo" className="w-48" />
      <span className="text-xs italic mb-4">Type Mixers Photo Booth</span>

      <button
        className="relative flex items-center justify-center cursor-pointer"
        onClick={() =>
          startCaptureSequence({
            setIsStarted,
            webcamRef,
            setCapturedImages,
            setCurrentCount,
          })
        }
      >
        <img src={heart} alt="heart" className="w-14 h-14 object-contain" />
        <div className="absolute inset-0 flex items-center justify-center text-cream text-sm pb-1">
          Start
        </div>
      </button>
    </div>
  );
};
