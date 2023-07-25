// export function convertImageDataToURL(imageData: ImageData[] | ImageData) {
//   if (!imageData) return null;
//   if (!Array.isArray(imageData)) {
//     imageData = [imageData];
//   }

//   let maxCanvasWidth = 0;
//   let maxCanvasHeight = 0;
//   console.log('max 확인', maxCanvasWidth, maxCanvasHeight, imageData.length);
//   for (let i = 0; i < imageData.length - 1; i++) {
//     maxCanvasWidth = Math.max(maxCanvasWidth, imageData[i]?.width);
//     maxCanvasHeight = Math.max(maxCanvasHeight, imageData[i]?.height);
//   }

//   const canvas = document.createElement('canvas');
//   canvas.width = maxCanvasWidth;
//   canvas.height = maxCanvasHeight;
//   const context = canvas.getContext('2d');

//   for (let e of imageData) {
//     context.putImageData(e, 0, 0);
//   }

//   const dataURL = canvas.toDataURL();

//   return dataURL;
// }

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
