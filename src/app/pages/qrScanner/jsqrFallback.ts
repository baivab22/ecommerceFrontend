// jsQR fallback for QR/barcode scanning
// This file is used for fallback scanning in browsers that do not support BarcodeDetector API.
import jsQR from 'jsqr';

export async function scanWithJsQR(videoElement, handleOrderScan, scanning) {
  if (!videoElement) return;
  const canvas = document.createElement('canvas');
  canvas.width = videoElement.videoWidth;
  canvas.height = videoElement.videoHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('2D context not available')
  }
  ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);
  if (code) {
    handleOrderScan(code.data);
  }
  if (scanning) {
    setTimeout(() => scanWithJsQR(videoElement, handleOrderScan, scanning), 500);
  }
}
