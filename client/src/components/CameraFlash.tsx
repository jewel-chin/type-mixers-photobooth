import { useState, useEffect } from "react";

export const CameraFlash = ({ isFlashing }: { isFlashing: boolean }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isFlashing) {
      setVisible(true);
      const timer = setTimeout(() => setVisible(false), 100);
      return () => clearTimeout(timer);
    }
  }, [isFlashing]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-cream opacity-50 z-[100] animate-out fade-out duration-100" />
  );
};
