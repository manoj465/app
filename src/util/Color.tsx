const convertHSVToRgb: (h: number, s: number, v: number) => [number, number, number] = (
  h,
  s,
  v
) => {
  var r, g, b;
  var i;
  var f, p, q, t;

  // Make sure our arguments stay in-range
  h = Math.max(0, Math.min(360, h));
  s = Math.max(0, Math.min(100, s));
  v = Math.max(0, Math.min(100, v));

  // We accept saturation and value arguments from 0 to 100 because that's
  // how Photoshop represents those values. Internally, however, the
  // saturation and value are calculated from a range of 0 to 1. We make
  // That conversion here.
  s /= 100;
  v /= 100;

  if (s == 0) {
    // Achromatic (grey)
    r = g = b = v;
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }

  h /= 60; // sector 0 to 5
  i = Math.floor(h);
  f = h - i; // factorial part of h
  p = v * (1 - s);
  q = v * (1 - s * f);
  t = v * (1 - s * (1 - f));

  switch (i) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;

    case 1:
      r = q;
      g = v;
      b = p;
      break;

    case 2:
      r = p;
      g = v;
      b = t;
      break;

    case 3:
      r = p;
      g = q;
      b = v;
      break;

    case 4:
      r = t;
      g = p;
      b = v;
      break;

    default:
      // case 5:
      r = v;
      g = p;
      b = q;
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/** 
 * @deprecated
 */
const _convertRGBToHex: (r: number, g: number, b: number) => string = (
  r,
  g,
  b
) => {
  var _r = r.toString(16);
  var _g = g.toString(16);
  var _b = b.toString(16);

  if (_r.length == 1) _r = "0" + r;
  if (_g.length == 1) _g = "0" + g;
  if (_b.length == 1) _b = "0" + b;

  return "#" + _r + _g + _b;
};

const convertRGBToHex: (hsv: [number, number, number]) => string = (hsv) => {
  var _r = hsv[0].toString(16);
  var _g = hsv[1].toString(16);
  var _b = hsv[2].toString(16);

  if (_r.length == 1) _r = "0" + hsv[0];
  if (_g.length == 1) _g = "0" + hsv[1];
  if (_b.length == 1) _b = "0" + hsv[2];

  return "#" + _r + _g + _b;
};

export { convertHSVToRgb, _convertRGBToHex, convertRGBToHex };
