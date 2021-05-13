import React from "react";
import { scaleBand, scaleLinear, max, format } from "d3";
import { Bars } from "./Bars";
import { XAxis } from "./XAxis";
import { YAxis } from "./YAxis";
import { useWindowSize } from "react-use";
const margin = { top: 60, right: 20, bottom: 20, left: 20 };

export const HorizontalBars = ({
  data = [],
  height = 300,
  width,
  xAxisKey = "",
  yAxisKey = "",
  style = {},
}) => {
  const { width: windowWidth } = useWindowSize();
  const svgWidth = windowWidth && !width ? windowWidth - 100 : width || 1000;
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = svgWidth - margin.left - margin.right;
  const siFormat = (n) => format(".2s")(n).replace("G", "B");
  const xAxisTickFormat = (tickValue) => siFormat(tickValue);

  const yScale = scaleBand()
    .domain(data.map((d) => d[yAxisKey]))
    .range([0, innerHeight])
    .paddingInner(0.5);

  const xScale = scaleLinear()
    .domain([0, max(data, (d) => d[xAxisKey])])
    .range([0, innerWidth]);

  return (
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
          <YAxis
            yScale={yScale}
            tickValueFormat={(tickValue) => `${tickValue}`}
          />
        </g>
        <XAxis
          xScale={xScale}
          innerHeight={innerHeight}
          tickValueFormat={(tickValue) => xAxisTickFormat(tickValue)}
        />
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
  );
};
