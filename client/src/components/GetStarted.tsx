import React from "react";
import Webcam from "react-webcam";
import TypeMixersLogo from "../assets/type_logo.png";
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
        onClick={() =>
          startCaptureSequence({
            setIsStarted,
            webcamRef,
            setCapturedImages,
            setCurrentCount,
          })
        }
        className="base-button"
      >
        Start
      </button>
    </div>
  );
};
