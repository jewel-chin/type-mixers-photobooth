import PixelsImage from "react-pixels";
import TypeMixersLogo from "../assets/type_logo.png";
import { useDeviceDetect } from "../hooks/useDeviceDetect";

type Props = {
  stripRef: React.RefObject<HTMLDivElement | null>;
  photoStripBgColor: string;
  capturedImages: string[];
  filter: keyof typeof import("../constants/const").filters;
  textColor: "black" | "white";
  customText: string;
  showDate: boolean;
  todayDate: string;
  fontFamily: string;
};

export const PhotoStrip = ({
  stripRef,
  photoStripBgColor,
  capturedImages,
  filter,
  textColor,
  customText,
  showDate,
  todayDate,
  fontFamily,
}: Props) => {
  const isTouchDevice = useDeviceDetect();
  return (
    <div
      ref={stripRef}
      className="custom-photobooth-strip-container"
      style={{
        backgroundColor: photoStripBgColor,
      }}
    >
      <div
        className={
          isTouchDevice
            ? "custom-photobooth-strip-mobile"
            : "custom-photobooth-strip-desktop"
        }
      >
        {capturedImages.map((imgSrc, index) => (
          <PixelsImage
            key={index}
            src={imgSrc}
            style={{
              filter: filter === "greyscale" ? "contrast(130%)" : "none",
            }}
            filter={filter}
            className={`w-[250px] ${isTouchDevice ? "mb-0" : "mb-2"}`}
          />
        ))}
      </div>
      <div className="custom-photobooth-strip-bottom-bar">
        <img src={TypeMixersLogo} alt="logo" className="w-24 pt-4 pb-2" />
        <div className="flex flex-col items-center px-4 pb-4 w-[250px]">
          <span
            style={{ fontFamily: fontFamily }}
            className={`photo-strip-text text-sm w-full ${
              textColor === "white" ? "text-white" : "text-black"
            }`}
          >
            {customText}
          </span>
          {showDate && (
            <span
              style={{ fontFamily: fontFamily }}
              className={`photo-strip-text text-xs mt-2 ${
                textColor === "white" ? "text-white" : "text-black"
              }`}
            >
              {todayDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
