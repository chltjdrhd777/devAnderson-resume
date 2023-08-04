export function genMergedImageData(imageData: ImageData[] | ImageData) {
  if (!imageData) return null;
  if (!Array.isArray(imageData)) {
    imageData = [imageData];
  }

  const { maxCanvasWidth, maxCanvasHeight } = calculateMaxSize(imageData);
  const canvas = document.createElement('canvas');
  canvas.width = maxCanvasWidth;
  canvas.height = maxCanvasHeight;
  const context = canvas.getContext('2d');

  for (let e of imageData) {
    context.putImageData(e, 0, 0);
  }

  return { mergedImageData: context.getImageData(0, 0, canvas.width, canvas.height), dataURL: canvas.toDataURL() };
}

function calculateMaxSize(imageData: ImageData[]) {
  let maxCanvasWidth = 0;
  let maxCanvasHeight = 0;

  for (let e of imageData) {
    if (e.width > maxCanvasWidth) {
      maxCanvasWidth = e.width;
    }

    if (e.height > maxCanvasHeight) {
      maxCanvasHeight = e.height;
    }
  }

  return { maxCanvasWidth, maxCanvasHeight };
}
