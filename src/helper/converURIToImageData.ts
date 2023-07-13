export function converURIToImageData(uri: string) {
  return new Promise<ImageData>((resolve, reject) => {
    if (!uri) return reject();
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    const image = new Image();
    image.src = uri;
    image.addEventListener(
      'load',
      () => {
        console.log('이미지 로드 완료', image);
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        resolve(context.getImageData(0, 0, canvas.width, canvas.height));
      },
      false,
    );
  });
}
