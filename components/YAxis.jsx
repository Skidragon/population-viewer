export const YAxis = ({ yScale, tickValueFormat }) => {
  return yScale.domain().map((tickValue) => {
    return (
      <text
        style={{
          fontSize: "1.5rem",
        }}
        key={tickValue}
        dy=".7"
        y={yScale(tickValue) + yScale.bandwidth() / 2}
      >
        {tickValueFormat(tickValue)}
      </text>
    );
  });
};
