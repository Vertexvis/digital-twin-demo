import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import { ResponsiveLine } from "@nivo/line";
import React from "react";
import { Sensor } from "../lib/time-series";
import { Options } from "./LeftDrawer";
import { TimeSeriesData } from "./TimeSeriesData";

interface Props {
  readonly onSelect: (timestamp: string) => Promise<void>;
  readonly panel: Options;
  readonly sensor: Sensor;
  readonly timestamp: string;
}

const useStyles = makeStyles(() => ({
  expanded: {
    boxShadow: "none",
    maxHeight: "20rem",
  },
  paper: {
    height: `20rem`,
  },
  title: {
    textTransform: "uppercase",
  },
}));

export function BottomDrawer({
  onSelect,
  panel,
  sensor,
  timestamp,
}: Props): JSX.Element {
  const { expanded, paper, title } = useStyles();

  return (
    <Drawer
      anchor="bottom"
      classes={{ paper }}
      open={Boolean(panel)}
      variant="persistent"
    >
      {panel === "data" && (
        <Accordion classes={{ expanded }} expanded={true}>
          <AccordionSummary>
            <Typography className={title} variant="body2">
              {sensor.meta.id} Data
            </Typography>
          </AccordionSummary>
          <TimeSeriesData
            onSelect={onSelect}
            sensor={sensor}
            timestamp={timestamp}
          />
        </Accordion>
      )}
      {panel === "chart" && (
        <Box overflow="hidden" height="100%" width="100%">
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
        </Box>
      )}
    </Drawer>
  );
}
