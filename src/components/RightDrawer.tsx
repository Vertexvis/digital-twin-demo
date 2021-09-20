import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Typography from "@mui/material/Typography";
import React from "react";

import { AssetProps, Assets } from "./Assets";
import { FaultProps, Faults } from "./Faults";
import { BottomDrawerHeight, RightDrawerWidth } from "./Layout";
import {
  MetadataProperties,
  Props as MetadataProps,
} from "./MetadataProperties";
import { SensorProps, Sensors } from "./Sensors";

interface Props {
  readonly assets: AssetProps;
  readonly bottomOpen: boolean;
  readonly faults: FaultProps;
  readonly metadata: MetadataProps;
  readonly sensors: SensorProps;
}

export function RightDrawer({
  assets,
  bottomOpen,
  faults,
  metadata,
  sensors,
}: Props): JSX.Element {
  return (
    <Drawer
      anchor="right"
      sx={{
        display: { sm: "block", xs: "none" },
        flexShrink: 0,
        width: RightDrawerWidth,
        [`& .${drawerClasses.paper}`]: bottomOpen
          ? {
              height: `calc(100% - ${BottomDrawerHeight}px)`,
              width: RightDrawerWidth,
            }
          : { height: `calc(100% - 57px)`, width: RightDrawerWidth },
      }}
      variant="permanent"
    >
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ textTransform: "uppercase" }} variant="body2">
            Sensors
          </Typography>
        </AccordionSummary>
        <Sensors {...sensors} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ textTransform: "uppercase" }} variant="body2">
            Assets
          </Typography>
        </AccordionSummary>
        <Assets {...assets} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ textTransform: "uppercase" }} variant="body2">
            Fault Codes
          </Typography>
        </AccordionSummary>
        <Faults {...faults} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ textTransform: "uppercase" }} variant="body2">
            Metadata Properties
          </Typography>
        </AccordionSummary>
        <MetadataProperties {...metadata} />
      </Accordion>
    </Drawer>
  );
}
