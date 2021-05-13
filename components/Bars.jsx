export const Bars = ({
  data = [],
  xScale,
  yScale,
  xValue,
  yValue,
  tooltipFormat,
}) => {
  return data.map((d, i) => {
    return (
      <g key={yValue(d)} aria-label={yValue(d)} tabIndex={0}>
        <rect
          y={yScale(yValue(d))}
          width={xScale(xValue(d))}
          height={yScale.bandwidth()}
          style={{
            fill: `#42A5B3`,
          }}
        >
          <title>{tooltipFormat(d)}</title>
        </rect>
      </g>
    );
  });
};
