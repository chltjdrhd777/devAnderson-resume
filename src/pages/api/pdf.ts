import puppeteer from 'puppeteer';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const browser = await puppeteer.launch();
  const HOST = process.env.HOST;
  try {
    const page = await browser.newPage();
    await page.goto(HOST, { waitUntil: 'networkidle0' });
    await page.emulateMediaType('screen');
    await page.evaluate((_) => {
      const graidentHeader = document.querySelector('#graident-header') as HTMLElement;
      const portalContainer = document.querySelector('#portal-container') as HTMLElement;
      graidentHeader.style.display = 'none';
      portalContainer.style.display = 'none';

      const animated = document.querySelectorAll('.animate');
      animated.forEach((el) => el.classList.add('fadeIn'));
    });
    await page.waitForTimeout(1000);

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      scale: 1,
      margin: {
        top: 50,
        bottom: 100,
      },
    });
    res.send(pdfBuffer);
    await browser.close();
  } catch (err) {
    console.log(err);
    await browser.close();
  }
};
