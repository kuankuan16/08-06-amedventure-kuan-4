const easeIn = { x: [0.45], y: [1] };
const easeOut = { x: [0.16], y: [1] };

const pixelSpecs = [
  {
    home: [72, 120],
    entry: [-210, -120],
    size: 18,
    drift: [
      [28, -22],
      [-18, 34],
      [36, 20],
      [-24, -14],
    ],
    opacity: 58,
  },
  {
    home: [510, 62],
    entry: [810, -210],
    size: 28,
    drift: [
      [-38, 26],
      [24, 44],
      [-26, -30],
      [34, -12],
    ],
    opacity: 88,
  },
  {
    home: [570, 250],
    entry: [860, 170],
    size: 16,
    drift: [
      [-22, -34],
      [30, 18],
      [-18, 40],
      [24, -24],
    ],
    opacity: 62,
  },
  {
    home: [18, 358],
    entry: [-250, 380],
    size: 24,
    drift: [
      [32, 28],
      [-14, -38],
      [38, -12],
      [-24, 24],
    ],
    opacity: 82,
  },
  {
    home: [482, 470],
    entry: [820, 520],
    size: 18,
    drift: [
      [-30, 22],
      [24, -34],
      [34, 28],
      [-16, -18],
    ],
    opacity: 66,
  },
  {
    home: [78, 605],
    entry: [-230, 690],
    size: 30,
    drift: [
      [26, -38],
      [40, 18],
      [-28, 30],
      [-18, -24],
    ],
    opacity: 76,
  },
  {
    home: [540, 708],
    entry: [830, 920],
    size: 22,
    drift: [
      [-34, -26],
      [20, -42],
      [30, 22],
      [-22, 34],
    ],
    opacity: 90,
  },
  {
    home: [288, 774],
    entry: [310, 1060],
    size: 15,
    drift: [
      [-26, -30],
      [36, -10],
      [-18, 32],
      [24, 18],
    ],
    opacity: 60,
  },
] as const;

function positionFrames(
  home: readonly [number, number],
  entry: readonly [number, number],
  drift: readonly (readonly [number, number])[],
) {
  const at = (offset: readonly [number, number]) => [
    home[0] + offset[0],
    home[1] + offset[1],
    0,
  ];
  const homePosition = [home[0], home[1], 0];
  return [
    { t: 0, s: [...entry, 0], e: homePosition, i: easeIn, o: easeOut },
    { t: 45, s: homePosition, e: at(drift[0]), i: easeIn, o: easeOut },
    { t: 88, s: at(drift[0]), e: at(drift[1]), i: easeIn, o: easeOut },
    { t: 132, s: at(drift[1]), e: at(drift[2]), i: easeIn, o: easeOut },
    { t: 176, s: at(drift[2]), e: at(drift[3]), i: easeIn, o: easeOut },
    { t: 216, s: at(drift[3]), e: homePosition, i: easeIn, o: easeOut },
    { t: 240, s: homePosition },
  ];
}

function rotationFrames(index: number) {
  const direction = index % 2 === 0 ? 1 : -1;
  return [
    { t: 0, s: [-18 * direction], e: [0], i: easeIn, o: easeOut },
    { t: 45, s: [0], e: [9 * direction], i: easeIn, o: easeOut },
    { t: 110, s: [9 * direction], e: [-7 * direction], i: easeIn, o: easeOut },
    { t: 178, s: [-7 * direction], e: [6 * direction], i: easeIn, o: easeOut },
    { t: 218, s: [6 * direction], e: [0], i: easeIn, o: easeOut },
    { t: 240, s: [0] },
  ];
}

export const aboutPixelsLottie = {
  v: "5.13.0",
  fr: 30,
  ip: 0,
  op: 241,
  w: 600,
  h: 800,
  nm: "AMED ambient pixels",
  ddd: 0,
  assets: [],
  layers: pixelSpecs.map((pixel, index) => ({
    ddd: 0,
    ind: index + 1,
    ty: 4,
    nm: `AMED pixel ${index + 1}`,
    sr: 1,
    ks: {
      o: { a: 0, k: pixel.opacity },
      r: { a: 1, k: rotationFrames(index) },
      p: { a: 1, k: positionFrames(pixel.home, pixel.entry, pixel.drift) },
      a: { a: 0, k: [0, 0, 0] },
      s: { a: 0, k: [100, 100, 100] },
    },
    ao: 0,
    shapes: [
      {
        ty: "gr",
        it: [
          {
            d: 1,
            ty: "rc",
            s: { a: 0, k: [pixel.size, pixel.size] },
            p: { a: 0, k: [0, 0] },
            r: { a: 0, k: pixel.size * 0.22 },
            nm: "Rounded pixel",
          },
          {
            ty: "fl",
            c: {
              a: 0,
              k: index % 3 === 0 ? [0.47, 0.78, 0.88, 1] : [0, 0.659, 0.816, 1],
            },
            o: { a: 0, k: 100 },
            r: 1,
            bm: 0,
            nm: "AMED blue",
          },
          {
            ty: "tr",
            p: { a: 0, k: [0, 0] },
            a: { a: 0, k: [0, 0] },
            s: { a: 0, k: [100, 100] },
            r: { a: 0, k: 0 },
            o: { a: 0, k: 100 },
            sk: { a: 0, k: 0 },
            sa: { a: 0, k: 0 },
          },
        ],
        nm: `Pixel ${index + 1}`,
      },
    ],
    ip: 0,
    op: 241,
    st: 0,
    bm: 0,
  })),
} as const;
