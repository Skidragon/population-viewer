import Head from "next/head";
import styles from "../styles/Home.module.css";
import { HorizontalBars } from "../components/HorizontalBars";
import useSWR from "swr";
import { useEffect, useState } from "react";
import { format } from "d3";
import axios from "axios";
const Error = ({ children }) => {
  return (
    <div
      style={{
        background: "#1A1110",
        color: "white",
        padding: "1rem",
        width: "100%",
      }}
    >
      {children}
    </div>
  );
};
const fetcher = (url) => axios.get(url).then((res) => res.data);

export default function Home() {
  const {
    data = [],
    isValidating,
    revalidate,
    error,
  } = useSWR("/api/population-by-country", fetcher, {
    refreshWhenOffline: true,
    shouldRetryOnError: false,
  });
  const [dots, setDots] = useState(".");
  useEffect(() => {
    let updateLoadindicator;
    if (isValidating) {
      updateLoadindicator = setInterval(() => {
        setDots((prevState) => {
          if (prevState.length === 3) {
            setDots("");
          } else {
            setDots(prevState + ".");
          }
        });
      }, 500);
    }
    return () => {
      clearInterval(updateLoadindicator);
    };
  }, [isValidating]);
  const [countriesToShow, setCountriesToShow] = useState(10);
  const [isAscending, setIsAscending] = useState(false);
  const formatPopulation = (value) => {
    const toNumber = value.replace(/,/g, "");
    return format(".2s")(toNumber).replace("G", "B");
  };
  const countriesData = data
    .slice(0, countriesToShow)
    .map((d) => {
      return {
        ...d,
        country: `${d.country} - ${formatPopulation(d.population)}`,
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
        <ul>
          <li>
            <span style={{ marginRight: "4px" }}>Data from:</span>
            <a href="https://www.worldometers.info/world-population/population-by-country/">
              https://www.worldometers.info/world-population/population-by-country/
            </a>
          </li>
          <li>
            <span style={{ marginRight: "4px" }}>Code Repo Link:</span>
            <a href="https://github.com/Skidragon/population-viewer">
              Git Repo
            </a>
          </li>
        </ul>
      </header>
      <main className={styles.main}>
        <div
          style={{
            display: "flex",
            flexFlow: "column",
            top: 0,
            background: "white",
            width: "100%",
            padding: "1em",
          }}
          className={"sticky"}
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
          <p
            style={{
              lineHeight: 1.15,
              marginBottom: 0,
            }}
          >
            {`Top ${countriesData.length || 0} countries population estimate:  
          ${
            countriesData
              ? format(".2s")(
                  countriesData?.reduce((acc, cur) => acc + cur.population, 0)
                ).replace("G", "B")
              : 0
          }`}
          </p>
        </div>
        {isValidating && countriesData.length === 0 ? (
          <div
            style={{
              margin: "12px 0",
              fontSize: "2rem",
            }}
          >
            Loading Data{dots}
          </div>
        ) : null}

        {error?.response?.status === 429 ? (
          <Error>
            You have requested the countries' data way too many times. Come back
            in an hour.
          </Error>
        ) : null}
        {error?.response?.status !== 429 && error?.response?.status ? (
          <div
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
            }}
          >
            <Error>
              An error has occured, try again later or make an issue in the
              original github repo.
            </Error>
            <button
              onClick={revalidate}
              style={{
                margin: "1rem",
                fontSize: "1rem",
                padding: "1em",
              }}
            >
              Refetch?
            </button>
          </div>
        ) : null}
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
      </main>
      <button
        className={styles["scroll-up-btn"]}
        onClick={() => {
          window.scrollTo(0, 0);
        }}
      >
        ⬆️
      </button>
      <footer className={styles.footer}>@2021 Copyright</footer>
    </div>
  );
}
