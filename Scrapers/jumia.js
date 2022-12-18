const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const scrapeJumia = async (url) => {
  const res = await fetch(url);
  const data = await res.text();

  let pageurls = [];
  let productDetails = [];

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
    headless: false,
  });

  let page = await browser.newPage();
  for (let i = 0; i < pageurls.length; i++) {
    const url = pageurls[i];
    const promise = page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await promise;

    let imageUrl = await page.evaluate(() => {
      return document.querySelector(".sldr>a").href;
    });

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

    productDetails.push({ imageUrl, name, price, reviews });
  }

  await page.close();
  await browser.close();

  console.log(productDetails);

  // return productDetails;
};

// scrapeJumia("https://www.jumia.co.ke/mlp-iphone-x/");

// scrapeJumia("https://www.jumia.co.ke/catalog/?q=iphonex");

module.exports = { scrapeJumia };
