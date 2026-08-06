"use client";

import { useEffect, useState } from "react";
import { scrollTarget } from "@/lib/scroll";

export const useScrollClock = (provided?: number) => {
  const [measured, setMeasured] = useState(0);

  useEffect(() => {
    if (provided !== undefined) return;
    let frame = 0;
    const read = () => {
      frame = 0;
      setMeasured(scrollTarget(window.scrollY, window.innerHeight));
    };
    const requestRead = () => {
      if (!frame) frame = window.requestAnimationFrame(read);
    };
    read();
    window.addEventListener("scroll", requestRead, { passive: true });
    window.addEventListener("resize", requestRead);
    return () => {
      window.removeEventListener("scroll", requestRead);
      window.removeEventListener("resize", requestRead);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [provided]);

  return provided ?? measured;
};
