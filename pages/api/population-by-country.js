// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const axios = require("axios");
const cheerio = require("cheerio");

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

export default async (req, res) => {
  if (req.method === "GET") {
    try {
      // const populations = await getPopulationByCountry();
      return res.status(200).json([]);
    } catch (err) {
      console.log(err);
    }
  }
};
