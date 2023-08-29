// import puppeteer from 'puppeteer';
import chromium from 'chrome-aws-lambda';
import puppeteer from 'puppeteer-core';
import { NextApiRequest, NextApiResponse } from 'next';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const HOST = process.env.HOST;

  const browser = await puppeteer.launch({
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
    args: ['--no-sandbox'],
    // args: [...chromium.args, '--hide-scrollbars'],
    // defaultViewport: chromium.defaultViewport,
    // executablePath: await chromium.executablePath,
    // headless: true,
    // ignoreHTTPSErrors: true,
    // ignoreDefaultArgs: ['--disable-extensions', '--no-sandbox'],
  });

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
    await page.waitForTimeout(500);

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
