export const SCROLL_TRACK_LVH = 200;
export const clamp01 = (x: number) => Math.min(Math.max(x, 0), 1);
export const smoothstep = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
export const scrollTarget = (scrollY: number, viewportHeight: number) => {
  const track = 2 * viewportHeight;
  const p1 = clamp01(scrollY / track);
  const p2 = clamp01((scrollY - track) / track);
  const p3 = clamp01((scrollY - 2 * track) / track);
  const p4 = clamp01((scrollY + viewportHeight - 2 * track) / track);
  return p1 + p2 + p3 + p4;
};

