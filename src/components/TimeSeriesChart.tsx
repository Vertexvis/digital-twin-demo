import { ResponsiveLine } from "@nivo/line";
import { Sensor } from "../lib/time-series";

interface Props {
  readonly sensor: Sensor;
}

export function TimeSeriesChart({ sensor }: Props): JSX.Element {
  return (
    <ResponsiveLine
      colors={"#93C5FD"}
      data={[
        {
          id: sensor.meta.id,
          data: sensor.data.map((d) => ({
            x: d.timestamp.substring(11, 19), // Ex: 2021-04-01T12:15:07.000Z
            y: d.avg,
          })),
        },
      ]}
      margin={{ top: 10, right: 110, bottom: 75, left: 60 }}
      xScale={{ type: "point" }}
      yScale={{
        type: "linear",
        min: "auto",
        max: 16.25,
        stacked: true,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        orient: "bottom",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Timestamp",
        legendOffset: 40,
        legendPosition: "middle",
      }}
      axisLeft={{
        orient: "left",
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Average",
        legendOffset: -40,
        legendPosition: "middle",
      }}
      enableCrosshair={false}
      pointSize={10}
      pointBorderWidth={2}
      pointLabelYOffset={-12}
      useMesh={true}
      legends={[
        {
          anchor: "bottom-right",
          direction: "column",
          justify: false,
          translateX: 100,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: "left-to-right",
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: "circle",
          symbolBorderColor: "rgba(0, 0, 0, .5)",
          effects: [
            {
              on: "hover",
              style: {
                itemBackground: "rgba(0, 0, 0, .03)",
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
}
