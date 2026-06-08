import type { Browser } from "puppeteer-core";

/**
 * Launches headless Chrome. Uses @sparticuz/chromium's binary in serverless
 * (Vercel) environments, and falls back to a local Chrome install for `next dev`.
 */
async function launchBrowser(): Promise<Browser> {
  const puppeteer = await import("puppeteer-core");

  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const chromium = (await import("@sparticuz/chromium")).default;
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  }

  return puppeteer.launch({
    executablePath: process.env.CHROME_EXECUTABLE_PATH || "/usr/bin/google-chrome",
    headless: true,
  });
}

export async function renderHtmlToPdf(html: string): Promise<Buffer> {
  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "load" });
    const pdf = await page.pdf({
      format: "letter",
      printBackground: true,
      margin: { top: "0.75in", bottom: "0.75in", left: "0.75in", right: "0.75in" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
