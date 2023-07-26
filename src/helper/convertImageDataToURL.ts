export function convertImageDataToURL(imageData: ImageData[] | ImageData) {
  if (!imageData) return null;
  if (!Array.isArray(imageData)) {
    imageData = [imageData];
  }

  const canvas = document.createElement('canvas');

  const resultDataUrlList = [] as string[];

  for (let e of imageData) {
    canvas.width = e.width;
    canvas.height = e.height;
    const context = canvas.getContext('2d');
    context.putImageData(e, 0, 0);
    resultDataUrlList.push(canvas.toDataURL());
  }

  return resultDataUrlList;
}
