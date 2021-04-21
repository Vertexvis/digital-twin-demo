import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Box from "@material-ui/core/Box";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import { useRecoilValue } from "recoil";
import { Sensor } from "../lib/time-series";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TimeSeriesData } from "./TimeSeriesData";
import { bottomDrawerContentState } from "../lib/state";

interface Props {
  readonly sensor: Sensor;
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

export function BottomDrawer({ sensor }: Props): JSX.Element {
  const content = useRecoilValue(bottomDrawerContentState);
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
          <TimeSeriesData sensor={sensor} />
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
