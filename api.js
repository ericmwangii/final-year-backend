const express = require("express");
const router = express.Router();
const scrapeJumia = require("./Scrapers/jumia");
const scrapeKilimall = require("./Scrapers/kilimall");

router.get("/api", async (request, response) => {
  let search = request.query.q;
  const JumiaUrl = `https://www.jumia.co.ke/catalog/?q=${search}`;
  const KilimallUrl = `https://www.kilimall.co.ke/new/commoditysearch?q=${search}`;

  let jumiaScraper = await scrapeJumia.scrapeJumia(JumiaUrl);
  let kilimallScrper = await scrapeKilimall.scrapeKilimall(KilimallUrl);

  const jumia = jumiaScraper;
  const kilimall = kilimallScrper;

  const data = [...jumia, ...kilimall];

  response.json(data);
});

module.exports = router;
