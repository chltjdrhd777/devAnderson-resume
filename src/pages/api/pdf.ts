import puppeteer from 'puppeteer';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost:3000');
    await page.emulateMediaType('screen');

    const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });

    res.send(pdfBuffer);

    await browser.close();
  } catch (err) {
    alert(err);
  }
};
