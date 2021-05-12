import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import { Sensor } from "../lib/time-series";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TimeSeriesData } from "./TimeSeriesData";

export type Content = "data" | "chart" | undefined;

interface Props {
  readonly content: Content;
  readonly onSelect: (timestamp: string) => Promise<void>;
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
  content,
  onSelect,
  sensor,
  timestamp,
}: Props): JSX.Element {
  const { expanded, paper, title } = useStyles();

  return (
    <Drawer
      anchor="bottom"
      classes={{ paper }}
      open={Boolean(content)}
      variant="persistent"
    >
      {content === "data" && (
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
      {content === "chart" && (
        <Box overflow="hidden" height="100%" width="100%">
          <TimeSeriesChart sensor={sensor} />
        </Box>
      )}
    </Drawer>
  );
}
