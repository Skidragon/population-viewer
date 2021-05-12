import React from "react";
import { scaleBand, scaleLinear, max } from "d3";
import { useWindowDimensions } from "../hooks/useWindowDimensions";

const margin = { top: 20, right: 20, bottom: 20, left: 200 };
export const HorizontalBars = ({
  data = [],
  getLabelValue = (record) => {},
  height = 300,
  width,
  xAxisKey = "",
  yAxisKey = "",
  style = {},
}) => {
  const { width: windowWidth } = useWindowDimensions();
  const svgWidth = windowWidth && !width ? windowWidth - 100 : width || 1000;
  const innerHeight = height - margin.top - margin.bottom;
  const innerWidth = svgWidth - margin.left - margin.right;
  const yScale = scaleBand()
    .domain(data.map((d) => d[yAxisKey]))
    .range([0, innerHeight]);

  const xScale = scaleLinear()
    .domain([0, max(data, (d) => d[xAxisKey])])
    .range([0, innerWidth]);

  console.log(xScale.ticks());
  return (
    <svg width={svgWidth} height={height} style={style}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {xScale.ticks().map((tickValue) => {
          return (
            <g key={tickValue} transform={`translate(${xScale(tickValue)}, 0)`}>
              <line y2={innerHeight} stroke="red" />
              <text
                dy=".71em"
                y={innerHeight + 3}
                style={{ textAnchor: "middle" }}
              >
                {tickValue}
              </text>
            </g>
          );
        })}
        {yScale.domain().map((tickValue) => {
          return (
            <text
              key={tickValue}
              x={-3}
              dy=".7"
              y={yScale(tickValue) + yScale.bandwidth() / 2}
              style={{
                textAnchor: "end",
              }}
            >
              {tickValue}
            </text>
          );
        })}
        {data.map((d) => (
          <rect
            key={d[yAxisKey]}
            y={yScale(d[yAxisKey])}
            width={xScale(d[xAxisKey])}
            height={yScale.bandwidth()}
          />
        ))}
      </g>
    </svg>
  );
};
