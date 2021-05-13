import { useEffect } from "react";

export const XAxis = ({ xScale, innerHeight, tickValueFormat }) => {
  return xScale.ticks().map((tickValue) => {
    return (
      <g key={tickValue} transform={`translate(${xScale(tickValue)}, 0)`}>
        <line y1={-36} y2={innerHeight} stroke={"#C0C0BB"} />
        <text dy=".71em" y={-50} style={{ textAnchor: "middle", zIndex: 100 }}>
          {tickValueFormat(tickValue)}
        </text>
      </g>
    );
  });
};
