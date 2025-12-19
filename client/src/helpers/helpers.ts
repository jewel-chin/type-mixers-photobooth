import React from "react";
import html2canvas from "html2canvas";
import QRCode from "qrcode";

const WORKER_URL = "https://photobooth.type-mixers.workers.dev";

type Props = {
  stripRef: React.RefObject<HTMLDivElement | null>;
  setQrCode: React.Dispatch<React.SetStateAction<string | null>>;
};

export const generateQrForStrip = async ({ stripRef, setQrCode }: Props) => {
  // 1. Convert div to image
  if (!stripRef.current) return;

  const canvas = await html2canvas(stripRef.current, {
    backgroundColor: "transparent",
    scale: 4,
  });

  const blob = await new Promise((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });

  // 2. Upload to Cloudflare Worker
  try {
    const uploadRes = await fetch(`${WORKER_URL}/upload`, {
      method: "POST",
      body: blob,
      headers: {
        "Content-Type": "image/png",
      },
    });

    if (!uploadRes.ok) {
      console.error("Upload failed", await uploadRes.text());
      return;
    }

    const { id } = await uploadRes.json();
    const imageUrl = `${WORKER_URL}/p/${id}`;
    const qrDataUrl = await QRCode.toDataURL(imageUrl, {
      width: 300,
      margin: 2,
    });

    setQrCode(qrDataUrl);
  } catch (err) {
    console.error("Error uploading or generating QR:", err);
  }
};

// for image download
// const canvas = await html2canvas(stripRef.current, {
//   backgroundColor: "#ffffff", // ensures white background
//   scale: 2, // higher quality
// });
// const image = canvas.toDataURL("image/png");
// const link = document.createElement("a");
// link.href = image;
// link.download = "photobooth-strip.png";
// link.click();
