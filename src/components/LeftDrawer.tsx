import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TableChartIcon from "@material-ui/icons/TableChart";
import TimelineIcon from "@material-ui/icons/Timeline";
import React from "react";
import { LeftDrawerWidth } from "./Layout";

export type Options = "data" | "chart" | undefined;

interface Props {
  readonly isOpen?: Options;
  readonly onSelected: (isOpen?: Options) => void;
}

const useStyles = makeStyles(() => ({
  paper: {
    position: "relative",
    width: LeftDrawerWidth,
  },
}));

export function LeftDrawer({ isOpen, onSelected }: Props): JSX.Element {
  const { paper } = useStyles();
  return (
    <Drawer anchor="left" variant="permanent" classes={{ paper }}>
      <List>
        <ListItem
          button
          onClick={() => onSelected(isOpen === "data" ? undefined : "data")}
        >
          <ListItemIcon>
            <TableChartIcon color={isOpen === "data" ? "primary" : undefined} />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          onClick={() => onSelected(isOpen === "chart" ? undefined : "chart")}
        >
          <ListItemIcon>
            <TimelineIcon color={isOpen === "chart" ? "primary" : undefined} />
          </ListItemIcon>
        </ListItem>
      </List>
    </Drawer>
  );
}
