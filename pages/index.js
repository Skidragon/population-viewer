import Head from "next/head";
import styles from "../styles/Home.module.css";
import { HorizontalBars } from "../components/HorizontalBars";
import useSWR from "swr";
import { useState } from "react";
import { format } from "d3";
const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Home() {
  const { data = [] } = useSWR("/api/population-by-country", fetcher);
  const [countriesToShow, setCountriesToShow] = useState(10);
  const [isAscending, setIsAscending] = useState(true);
  const countriesData = data

    .slice(0, countriesToShow)
    .map((d) => {
      return {
        ...d,
        population: Number(d.population.replace(/,/g, "")),
      };
    })
    .sort((a, b) =>
      isAscending ? a.population - b.population : b.population - a.population
    );

  return (
    <div>
      <Head>
        <title>Population Scraper</title>
        <meta name="description" content="population" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header tabIndex={0}>
        <h1
          style={{
            textAlign: "center",
          }}
        >
          Population Scraper Project
        </h1>
      </header>
      <main className={styles.main}>
        <p>
          {`Total Estimate From Chart: 
          ${
            countriesData
              ? format(".2s")(
                  countriesData?.reduce((acc, cur) => acc + cur.population, 0)
                ).replace("G", "B")
              : 0
          }`}
        </p>
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            position: "sticky",
            top: 0,
            background: "white",
            width: "100%",
            padding: "1em",
          }}
        >
          <div>
            <span
              style={{
                marginRight: "4px",
              }}
            >
              Top
            </span>
            <select
              onChange={(e) => {
                setCountriesToShow(Number(e.target.value));
              }}
            >
              <option value={10}>10</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            <span
              style={{
                marginRight: "4px",
              }}
            >
              {" "}
              Countries in
            </span>
            <button
              onClick={() => {
                setIsAscending((prevState) => !prevState);
              }}
            >
              {isAscending ? "Ascending" : "Descending"}
            </button>{" "}
            order.
          </div>
        </div>
        <HorizontalBars
          style={{
            margin: "20px",
          }}
          chartTitle={`Top ${countriesData.length || 0} Countries Population`}
          height={countriesData.length * 75}
          getLabelValue={(record) => `${record.country} ${record.population}`}
          xAxisKey={"population"}
          yAxisKey={"country"}
          data={countriesData.length ? countriesData : []}
        />
        <div
          style={{
            marginBottom: "24px",
          }}
        >
          {`Data from: `}
          <a href="https://www.worldometers.info/world-population/population-by-country/">
            https://www.worldometers.info/world-population/population-by-country/
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <div>@2021 Copyright</div>
        <div>
          <a href="https://github.com/Skidragon/population-viewer">Git Repo</a>
        </div>
      </footer>
    </div>
  );
}
