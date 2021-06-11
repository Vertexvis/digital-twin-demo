import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";

import { AssetProps, Assets } from "./Assets";
import { FaultProps, Faults } from "./Faults";
import { RightDrawerWidth } from "./Layout";
import { Mapping, MappingProps } from "./Mapping";
import { MetadataProperties, MetadataProps } from "./MetadataProperties";
import { SensorProps, Sensors } from "./Sensors";

interface Props {
  readonly assets: AssetProps;
  readonly faults: FaultProps;
  readonly mapping: MappingProps;
  readonly metadata: MetadataProps;
  readonly sensors: SensorProps;
}

const useStyles = makeStyles(() => ({
  paper: {
    width: RightDrawerWidth,
  },
  title: {
    textTransform: "uppercase",
  },
}));

export function RightDrawer({
  assets,
  faults,
  mapping,
  metadata,
  sensors,
}: Props): JSX.Element {
  const { paper, title } = useStyles();

  return (
    <Drawer anchor="right" variant="permanent" classes={{ paper }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Sensors
          </Typography>
        </AccordionSummary>
        <Sensors {...sensors} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Assets
          </Typography>
        </AccordionSummary>
        <Assets {...assets} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Fault Codes
          </Typography>
        </AccordionSummary>
        <Faults {...faults} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Metadata Properties
          </Typography>
        </AccordionSummary>
        <MetadataProperties {...metadata} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Sensor Mapping
          </Typography>
        </AccordionSummary>
        <Mapping {...mapping} />
      </Accordion>
    </Drawer>
  );
}
