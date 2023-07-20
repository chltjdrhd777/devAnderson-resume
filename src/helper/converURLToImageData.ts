export function converURLToImageData(url: string) {
  return new Promise<ImageData | null>((resolve, reject) => {
    if (!url) return resolve(null);
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = url;
    image.addEventListener(
      'load',
      () => {
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      },
      false,
    );
    image.addEventListener('error', () => resolve(null));
  });
}
