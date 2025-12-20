import React from "react";

interface Props {
  selectedFont: string;
  setSelectedFont: React.Dispatch<React.SetStateAction<string>>;
}

export const fonts = [
  { name: "Default", value: "Helvetica Neue" },
  { name: "Playfair Display", value: "'Playfair Display', serif" },
  { name: "Inter", value: "'Inter', sans-serif" },
  { name: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { name: "Cursive", value: "cursive" },
];

export const FontSelector: React.FC<Props> = ({
  selectedFont,
  setSelectedFont,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label className="text-[0.6em] font-bold uppercase opacity-60">
        Typography
      </label>
      <select
        value={selectedFont}
        onChange={(e) => setSelectedFont(e.target.value)}
        className="w-full py-1 bg-cream border border-white/20 rounded text-[0.6em] tracking-normal outline-none focus:border-white/50 transition-colors"
        style={{ fontFamily: selectedFont }}
      >
        {fonts.map((font) => (
          <option
            key={font.value}
            value={font.value}
            style={{ fontFamily: font.value }}
          >
            {font.name}
          </option>
        ))}
      </select>
    </div>
  );
};
