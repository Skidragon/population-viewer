# Site: [Population Viewer](https://population-viewer.vercel.app/)

- [Site: Population Viewer](#site-population-viewer)
  - [Site Image(s)](#site-images)
  - [What I Learned](#what-i-learned)
  - [Code Highlights](#code-highlights)
    - [Bar Chart](#bar-chart)
    - [Scraping Population data](#scraping-population-data)
    - [Caching, Rate Limiting, and Slow Down](#caching-rate-limiting-and-slow-down)
  - [Getting Started](#getting-started)
  - [Learn More](#learn-more)
  - [Deploy on Vercel](#deploy-on-vercel)

## Site Image(s)
![Image of landing page](/readme-lib/images/landing.PNG)

## What I Learned

    - The basics of Next.js.
    - How to setup routes and middleware.
    - How to deploy to Vercel.
    - How to rate limit, slow down requests, and do internal caching.
    - How to web scrape with cheerio.
    - How to work with svgs.
    - Using d3.js to create a horizontal bar chart.
    - The terms domain and range.
    - Updating a favicon.


## Code Highlights

### Bar Chart

```jsx
<svg
  width={"100%"}
  height={height}
  style={{
    ...style,
    background: "#F5F3F2",
  }}
>
  <g transform={`translate(${margin.left},${margin.top})`}>
    <g transform={`translate(0,-25)`}>
      <YAxis yScale={yScale} tickValueFormat={(tickValue) => `${tickValue}`} />
    </g>
    {isWide ? (
      <XAxis
        xScale={xScale}
        innerHeight={innerHeight}
        tickValueFormat={(tickValue) => xAxisTickFormat(tickValue)}
      />
    ) : null}
    <Bars
      data={data}
      xScale={xScale}
      yScale={yScale}
      yValue={(d) => d.country}
      xValue={(d) => d.population}
      tooltipFormat={(d) => xAxisTickFormat(d.population)}
    />
  </g>
</svg>
```

### Scraping Population data

```jsx
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
```

### Caching, Rate Limiting, and Slow Down

```jsx
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
    } catch (err) {}
  }
};
```

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
