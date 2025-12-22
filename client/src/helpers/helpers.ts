import React from "react";
import QRCode from "qrcode";
import beepSound from "../assets/beep.wav";
import shutterSound from "../assets/shutter.wav";
import { MAX_CAPTURES, COUNT_STARTER, WORKER_URL } from "../constants/const";
import { toPng, toCanvas } from "html-to-image";
type Props = {
  stripRef: React.RefObject<HTMLDivElement | null>;
  setQrCode: React.Dispatch<React.SetStateAction<string | null>>;
};

const beepAudio = new Audio(beepSound);
const shutterAudio = new Audio(shutterSound);

export const generateQrForStrip = async ({ stripRef, setQrCode }: Props) => {
  // 1. Convert div to image
  if (!stripRef.current) return;

  // workaround: github.com/bubkoo/html-to-image/issues/361

  await toCanvas(stripRef.current);
  await toCanvas(stripRef.current);
  await toCanvas(stripRef.current);

  const canvas = await toCanvas(stripRef.current);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });

  if (!blob) {
    return;
  }

  // upload to cloudflare worker

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

export const handleDownload = async (
  stripRef: React.RefObject<HTMLDivElement | null>
) => {
  if (!stripRef.current) return;

  try {
    // workaround: github.com/bubkoo/html-to-image/issues/361

    await toPng(stripRef.current);
    await toPng(stripRef.current);
    await toPng(stripRef.current);

    const dataUrl = await toPng(stripRef.current);
    const link = document.createElement("a");
    link.download = "photo_strip_type_mixers.png";
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error("Download failed", err);
  }
};

export const handleShare = async (
  stripRef: React.RefObject<HTMLDivElement | null>
) => {
  if (!stripRef.current) return;

  // workaround: github.com/bubkoo/html-to-image/issues/361

  await toCanvas(stripRef.current);
  await toCanvas(stripRef.current);
  await toCanvas(stripRef.current);

  const canvas = await toCanvas(stripRef.current);
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((b) => resolve(b), "image/png");
  });

  if (!blob) {
    return;
  }

  const file = new File([blob], "photostrip.png", { type: "image/png" });
  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "Photo Strip",
    });
  }
};

type startCaptureSequenceProps = {
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
  webcamRef: React.RefObject<any>;
  setCapturedImages: React.Dispatch<React.SetStateAction<string[]>>;
  setCurrentCount: React.Dispatch<React.SetStateAction<number>>;
};

export const startCaptureSequence = ({
  setIsStarted,
  webcamRef,
  setCapturedImages,
  setCurrentCount,
}: startCaptureSequenceProps) => {
  setIsStarted(true);
  const runSequence = async () => {
    const takePhoto = () => {
      if (webcamRef.current) {
        const src = webcamRef.current.getScreenshot();
        setCapturedImages((prev) => [...prev, src!]);
      }
    };

    for (let i = 0; i < MAX_CAPTURES; i++) {
      let count = COUNT_STARTER;
      while (count >= 0) {
        setCurrentCount(count);
        if (count > 0) {
          playBeep();
          await new Promise((res) => setTimeout(res, 1000));
        } else if (count === 0) {
          playShutter();
          await new Promise((res) => setTimeout(res, 500));
        }
        count -= 1;
      }
      takePhoto();
      await new Promise((res) => setTimeout(res, 500));
    }
    setIsStarted(false); // Move to finished state
  };
  runSequence();
};
export const playBeep = () => {
  beepAudio.currentTime = 0;
  beepAudio.volume = 0.5;
  beepAudio.play();
};

export const playShutter = () => {
  shutterAudio.currentTime = 0;
  shutterAudio.play();
};
