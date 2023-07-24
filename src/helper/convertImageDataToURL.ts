export function convertImageDataToURL(imageData: ImageData) {
  if (!imageData) return null;

  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;

  const context = canvas.getContext('2d');
  context.putImageData(imageData, 0, 0);

  const dataURL = canvas.toDataURL();

  return dataURL;
}
