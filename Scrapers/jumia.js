import puppeteer from "puppeteer";
import * as cheerio from "cheerio";

const scrapeJumia = async (url) => {
  const res = await fetch(url);
  const data = await res.text();

  let pageurls = [];
  let productdetails = [];

  const $ = cheerio.load(data);

  $(".core").each((index, element) => {
    const urls = $(element).attr("href");

    pageurls[index] = `https://jumia.co.ke${urls}`;
    // console.log(baseUrl);
  });

  // console.log(pageurls);

  // url =
  //   "https://www.jumia.co.ke/iphone-6s-2gb-ram-64gb-12mp-camera-4g-lte-single-sim-rose-gold-apple-mpg267403.html";
  const browser = await puppeteer.launch({
    headless: true,
  });

  let page = await browser.newPage();
  for (let i = 0; i < pageurls.length; i++) {
    const url = pageurls[i];
    const promise = page.waitForNavigation({ waitUntil: "networkidle0" });
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await promise;

    let name = await page.evaluate(() => {
      return document.querySelector(".-fs20").textContent;
    });

    let price = await page.evaluate(() => {
      return document.querySelector(".-b").textContent;
    });

    let reviews = await page.evaluate(() => {
      revs = Array.from(document.querySelectorAll("p.-pvs"));
      return (r = revs.map((el) => el.innerHTML));
    });

    productdetails = {
      name: name,
      price: price,
      reviews: reviews,
    };

    console.log(productdetails);
  }

  await page.close();
  await browser.close();
};

scrapeJumia("https://www.jumia.co.ke/mlp-iphone-x/");
