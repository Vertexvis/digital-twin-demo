import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Drawer from "@material-ui/core/Drawer";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import { Components } from "@vertexvis/viewer";
import React from "react";
import { Assets } from "./Assets";
import { Faults } from "./Faults";
import { RightDrawerWidth } from "./Layout";
import { Mapping } from "./Mapping";
import { MetadataProperties } from "./MetadataProperties";
import { Sensors } from "./Sensors";

interface Props {
  readonly viewer: Components.VertexViewer | null;
}

const useStyles = makeStyles(() => ({
  paper: {
    width: RightDrawerWidth,
  },
  title: {
    textTransform: "uppercase",
  },
}));

export function RightDrawer({ viewer }: Props): JSX.Element {
  const { paper, title } = useStyles();

  return (
    <Drawer anchor="right" variant="permanent" classes={{ paper }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Sensors
          </Typography>
        </AccordionSummary>
        <Sensors viewer={viewer} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Assets
          </Typography>
        </AccordionSummary>
        <Assets />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Fault Codes
          </Typography>
        </AccordionSummary>
        <Faults />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Metadata Properties
          </Typography>
        </AccordionSummary>
        <MetadataProperties />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Sensor Mapping
          </Typography>
        </AccordionSummary>
        <Mapping />
      </Accordion>
    </Drawer>
  );
}
