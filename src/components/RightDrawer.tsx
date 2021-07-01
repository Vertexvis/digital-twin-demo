import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import Drawer from "@material-ui/core/Drawer";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import React from "react";

import { AssetProps, Assets } from "./Assets";
import { BottomDrawerHeight } from "./BottomDrawer";
import { FaultProps, Faults } from "./Faults";
import { RightDrawerWidth } from "./Layout";
import { MetadataProperties, MetadataProps } from "./MetadataProperties";
import { SensorProps, Sensors } from "./Sensors";
import { Settings, SettingsProps } from "./Settings";

interface Props {
  readonly assets: AssetProps;
  readonly bottomOpen: boolean;
  readonly faults: FaultProps;
  readonly metadata: MetadataProps;
  readonly sensors: SensorProps;
  readonly settings: SettingsProps;
}

const useStyles = makeStyles((theme) => {
  return {
    paper: {
      height: `calc(100% - ${theme.spacing(7) + 1}px)`,
      width: RightDrawerWidth,
    },
    paperOpen: {
      height: `calc(100% - ${BottomDrawerHeight}px)`,
      width: RightDrawerWidth,
    },
    title: { textTransform: "uppercase" },
  };
});

export function RightDrawer({
  assets,
  bottomOpen,
  faults,
  metadata,
  sensors,
  settings,
}: Props): JSX.Element {
  const { paper, paperOpen, title } = useStyles();

  return (
    <Drawer
      anchor="right"
      variant="permanent"
      classes={{
        paper: clsx({ [paperOpen]: bottomOpen, [paper]: !bottomOpen }),
      }}
    >
      <Accordion defaultExpanded>
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
            Settings
          </Typography>
        </AccordionSummary>
        <Settings {...settings} />
      </Accordion>
    </Drawer>
  );
}
