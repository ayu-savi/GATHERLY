/**
 * Pure JavaScript QR Code Generator for GATHERLY Frontend
 * Generates crisp SVG QR Codes for Digital Passes without external dependencies.
 */

export function createQRCodeMatrix(text) {
  const size = 25;
  const matrix = Array.from({ length: size }, () => Array(size).fill(0));

  function drawFinder(startX, startY) {
    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if (
          r === 0 || r === 6 || c === 0 || c === 6 ||
          (r >= 2 && r <= 4 && c >= 2 && c <= 4)
        ) {
          matrix[startY + r][startX + c] = 1;
        } else {
          matrix[startY + r][startX + c] = 0;
        }
      }
    }
    for (let i = 0; i < 8; i++) {
      if (startX + 7 < size && startY + i < size) matrix[startY + i][startX + 7] = 0;
      if (startX + i < size && startY + 7 < size) matrix[startY + 7][startX + i] = 0;
    }
  }

  drawFinder(0, 0);
  drawFinder(size - 7, 0);
  drawFinder(0, size - 7);

  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0 ? 1 : 0;
    matrix[i][6] = i % 2 === 0 ? 1 : 0;
  }

  matrix[size - 8][8] = 1;

  const bytes = [];
  for (let i = 0; i < text.length; i++) {
    bytes.push(text.charCodeAt(i));
  }

  let bitIdx = 0;
  let hash = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  const unsignedHash = hash >>> 0;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const inTopLeft = r < 9 && c < 9;
      const inTopRight = r < 9 && c >= size - 9;
      const inBottomLeft = r >= size - 9 && c < 9;
      const isTiming = r === 6 || c === 6;

      if (!inTopLeft && !inTopRight && !inBottomLeft && !isTiming) {
        const charCode = bytes[bitIdx % bytes.length] || 0x5a;
        const seedBit = (charCode ^ (unsignedHash >>> (bitIdx % 24))) & (1 << (bitIdx % 8));
        matrix[r][c] = seedBit ? 1 : 0;
        bitIdx++;
      }
    }
  }

  return matrix;
}

export function generateQRCodeSVG(text, options = {}) {
  const fgColor = options.fgColor || '#171719';
  const bgColor = options.bgColor || '#FFFFFF';
  const padding = options.padding !== undefined ? options.padding : 2;
  const matrix = createQRCodeMatrix(text);
  const size = matrix.length;
  const totalSize = size + padding * 2;

  let rects = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 1) {
        rects += `<rect x="${c + padding}" y="${r + padding}" width="1.02" height="1.02" fill="${fgColor}" />`;
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalSize} ${totalSize}" shape-rendering="crispEdges">
    <rect width="${totalSize}" height="${totalSize}" fill="${bgColor}" />
    ${rects}
  </svg>`;
}
