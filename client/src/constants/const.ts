import countDown_3 from "../assets/countdown_3.png";
import countDown_2 from "../assets/countdown_2.png";
import countDown_1 from "../assets/countdown_1.png";

export const filters = {
  none: "",
  greyscale: "greyscale",
};

export const WORKER_URL = "https://photobooth.by-jewel.workers.dev";
export const VIDEO_CONSTRAINTS = {
  width: 1280,
  height: 720,
  facingMode: "user",
};

export const MAX_CAPTURES = 4;
export const COUNT_STARTER = 3;

export const PRESET_COLORS = [
  "#392d28",
  "#e8d3b8",
  "#bc9c74",
  "#7c6f64",
  "#6F0707",
];

export const COUNTDOWN_IMAGE_URLS: { [key: number]: string } = {
  3: countDown_3,
  2: countDown_2,
  1: countDown_1,
};
