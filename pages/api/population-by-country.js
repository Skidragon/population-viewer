// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require("axios");
const cheerio = require("cheerio");
const NodeCache = require("node-cache");
const rateLimit = require("express-rate-limit");
const slowDown = require("express-slow-down");

const pageURLToScrape =
  "https://www.worldometers.info/world-population/population-by-country/";

const getPopulationByCountry = async () => {
  const { data: pageHTML } = await axios.get(pageURLToScrape);
  const $ = cheerio.load(pageHTML);
  const table = $("#example2");
  const collection = [];
  table.find("tbody tr").each((i, row) => {
    const $row = $(row);
    const country = {};
    const labels = ["rank", "country", "population"];
    //Get Values out of cells
    const tds = $row.find("td");
    const $tds = $(tds);
    const values = [];
    $tds.each((j, td) => {
      const $td = $(td);
      values.push($td.text());
    });
    for (let i = 0; i < labels.length; i++) {
      let label = labels[i];
      let value = values[i];
      country[label] = value;
    }
    collection.push(country);
  });
  return collection;
};
//Every hour, the cache resets
const myCache = new NodeCache({ stdTTL: 3600, checkperiod: 3600 });

const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minutes
  max: 15, // limit each IP to 60 requests per windowMs
});
const speedLimiter = slowDown({
  windowMs: 1 * 60 * 1000, // 1 minutes
  delayAfter: 15, // allow 15 requests per 1 minutes, then...
  delayMs: 500, // begin adding 500ms of delay per request above 100:
  // request # 101 is delayed by  500ms
  // request # 102 is delayed by 1000ms
  // request # 103 is delayed by 1500ms
  // etc.
});
function runMiddleware(req, res, fn) {
  return new Promise((resolve, reject) => {
    fn(req, res, (result) => {
      if (result instanceof Error) {
        return reject(result);
      }

      return resolve(result);
    });
  });
}
export default async (req, res) => {
  if (req.method === "GET") {
    try {
      await runMiddleware(req, res, limiter);
      await runMiddleware(req, res, speedLimiter);
      const cacheKey = "population-by-country";
      if (myCache.has(cacheKey)) {
        console.log(myCache.has(cacheKey));
        return res.status(200).json(myCache.get(cacheKey));
      } else {
        const populations = await getPopulationByCountry();
        myCache.set(cacheKey, populations);
        return res.status(200).json(populations);
      }
    } catch (err) {
      console.log(err);
    }
  }
};
