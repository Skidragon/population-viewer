import Head from "next/head";
import styles from "../styles/Home.module.css";
import { HorizontalBars } from "../components/HorizontalBars";
import useSWR from "swr";
const fetcher = (url) => fetch(url).then((res) => res.json());
export default function Home() {
  const { data = [] } = useSWR("/api/population-by-country", fetcher);

  return (
    <div className={styles.container}>
      <Head>
        <title>Population Scraper</title>
        <meta name="description" content="population" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header>
        <h1>Population By Country</h1>
      </header>
      <main className={styles.main}>
        <HorizontalBars
          style={{
            margin: "20px",
          }}
          height={500}
          getLabelValue={(record) => `${record.country} ${record.population}`}
          xAxisKey={"population"}
          yAxisKey={"country"}
          data={
            data
              ? data.slice(0, 10).map((d) => {
                  return {
                    ...d,
                    population: Number(d.population.replace(/,/g, "")),
                  };
                })
              : []
          }
        />
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}
