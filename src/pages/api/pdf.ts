import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const browser = await puppeteer.launch();
  const HOST = process.env.HOST;

  try {
    const page = await browser.newPage();
    await page.goto(HOST, {
      waitUntil: ['domcontentloaded', 'load', 'networkidle2'],
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
