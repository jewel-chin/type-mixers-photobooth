import Sketch from "@uiw/react-color-sketch";
import { filters, PRESET_COLORS } from "../constants/const";
import downloadIcon from "../assets/download.png";
import shareIcon from "../assets/share.png";
import { handleShare, handleDownload } from "../helpers/helpers";
import { FontSelector } from "./FontSelector";

type Props = {
  stripRef: React.RefObject<HTMLDivElement | null>;
  photoStripBgColor: string;
  setPhotoStripBgColor: React.Dispatch<React.SetStateAction<string>>;
  setFilter: React.Dispatch<React.SetStateAction<keyof typeof filters>>;
  filter: keyof typeof filters;
  customText: string;
  setCustomText: React.Dispatch<React.SetStateAction<string>>;
  textColor: "black" | "white";
  setTextColor: React.Dispatch<React.SetStateAction<"black" | "white">>;
  showDate: boolean;
  setShowDate: React.Dispatch<React.SetStateAction<boolean>>;
  generateQrCode: () => void;
  qrCode: string | null;
  isGeneratingQr: boolean;
  fontFamily: string;
  setFontFamily: React.Dispatch<React.SetStateAction<string>>;
};

export const PhotoStripConfigurator = ({
  stripRef,
  photoStripBgColor,
  setPhotoStripBgColor,
  setFilter,
  filter,
  customText,
  setCustomText,
  textColor,
  setTextColor,
  showDate,
  setShowDate,
  generateQrCode,
  qrCode,
  isGeneratingQr,
  fontFamily,
  setFontFamily,
}: Props) => {
  return (
    <div className="flex flex-col items-center gap-4">
      <span>Customize Your Photo Strip:</span>
      <div className="flex lg:flex-row items-start gap-4 flex-col">
        <div className="flex flex-row gap-2">
          <Sketch
            color={photoStripBgColor}
            presetColors={PRESET_COLORS}
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
            <label className="text-[0.6em] font-bold uppercase opacity-60">
              Add Message:
            </label>

            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="Type here..."
              className="text-[0.6em] bg-cream text-dark-brown p-1 text-sm tracking-normal rounded border border-gray-600"
            />
            <FontSelector
              selectedFont={fontFamily}
              setSelectedFont={setFontFamily}
            />
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => setTextColor("white")}
                className={`text-sm ${
                  textColor === "white" ? "base-button" : "unselected-button"
                }`}
              >
                White Text
              </button>
              <button
                onClick={() => setTextColor("black")}
                className={`text-sm ${
                  textColor === "black" ? "base-button" : "unselected-button"
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
              onClick={() => handleDownload(stripRef)}
              className="download-button"
            >
              <img
                src={downloadIcon}
                alt="download image"
                className="w-5 h-5"
              />
            </button>
            <button
              onClick={() => handleShare(stripRef)}
              className="download-button"
            >
              <img src={shareIcon} alt="share image" className="w-5 h-5" />
            </button>
            <button onClick={() => generateQrCode()} className="base-button">
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
                  Scan to get your photo strip! Expires in 2 minutes. <br />{" "}
                  Remember to save :)
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
  );
};
