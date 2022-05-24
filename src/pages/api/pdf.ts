import puppeteer from 'puppeteer';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const browser = await puppeteer.launch();

  try {
    const page = await browser.newPage();
    await page.goto('http://localhost:3000', {
      waitUntil: ['domcontentloaded', 'load', 'networkidle0'],
    });
    await page.emulateMediaType('screen');

    await page.evaluate(_ => {
      const target = document.querySelector('#pdf-btn') as HTMLElement;
      if (target) {
        target.style.display = 'none';
      }
    });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      scale: 0.8,
    });

    res.send(pdfBuffer);

    await browser.close();
  } catch (err) {
    console.log(err);
    await browser.close();
  }
};
