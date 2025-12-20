import PixelsImage from "react-pixels";
import TypeMixersLogo from "../assets/type_logo.png";

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
  return (
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
            filter: filter === "greyscale" ? "contrast(130%)" : "none",
          }}
          filter={filter}
          className="w-[250px] mb-2"
        />
      ))}
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
            className={`photo-strip-text text-xs mt-2 ${
              textColor === "white" ? "text-white" : "text-black"
            }`}
          >
            {todayDate}
          </span>
        )}
      </div>
    </div>
  );
};
