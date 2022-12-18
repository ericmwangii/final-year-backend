const puppeteer = require("puppeteer");

const scrapeKilimall = async (url) => {
  let productDetails = [];

  const browser = await puppeteer.launch({
    headless: true,
  });

  let page = await browser.newPage();

  await page.goto(url, {
    waitUntil: "networkidle0",
    timeout: 0,
  });

  let urls = await page.evaluate(() => {
    pagelink = Array.from(document.querySelectorAll(".showHand"));
    return (r = pagelink.slice(0, 10).map((el) => el.href));
  });

  //   console.log(urls);

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i];
    const promise = page.waitForNavigation({ waitUntil: "networkidle2" });
    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 0,
    });
    await promise;

    let imageUrl = await page.evaluate(() => {
      return document.querySelector(".preview-box>img").getAttribute("src");
    });

    let name = await page.evaluate(() => {
      return document.querySelector(".goodsTitle").textContent;
    });

    let price = await page.evaluate(() => {
      return document.querySelector(".bold").textContent;
    });

    let reviews = await page.evaluate(() => {
      revs = Array.from(document.querySelectorAll("#review"));
      return (r = revs.map((el) => el.textContent));
    });

    // console.log({ imageUrl, name, price, reviews });
    productDetails.push({ imageUrl, name, price, reviews });
  }

  await page.close();
  await browser.close();

  // console.log(productDetails);
  return productDetails;
};

// scrapeKilimall("https://www.kilimall.co.ke/new/commoditysearch?q=iphone%20x");

// export default scrapeKilimall;
module.exports = { scrapeKilimall };
