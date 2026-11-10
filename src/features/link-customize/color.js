/** Colour helpers for the Link preview. */

export function isHex(value) {
  return /^#[0-9a-f]{6}$/i.test(value ?? "");
}

function luminance(hex) {
  const channels = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const [r, g, b] = channels.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** White or ink text, whichever reads better on `hex`. */
export function textOn(hex) {
  if (!isHex(hex)) return "#ffffff";
  const l = luminance(hex);
  const onWhite = 1.05 / (l + 0.05);
  const onInk = (l + 0.05) / (luminance("#141414") + 0.05);
  return onWhite >= onInk ? "#ffffff" : "#141414";
}

export function isDark(hex) {
  return isHex(hex) && luminance(hex) < 0.2;
}
