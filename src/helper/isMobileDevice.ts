export function isMobileDevice() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /mobi|android/i.test(userAgent);
}
