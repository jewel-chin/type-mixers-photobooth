import { useState, useEffect } from "react";
// https://codesandbox.io/s/cocky-glitter-46s5r5?file=/useDeviceDetect.js:0-325
// https://stackoverflow.com/questions/39435395/reactjs-how-to-determine-if-the-application-is-being-viewed-on-mobile-or-deskto

export function useDeviceDetect() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  useEffect(() => {
    if (!window.matchMedia) return;
    setIsTouchDevice(window.matchMedia("(pointer:coarse)").matches);
  }, []);

  return isTouchDevice;
}
