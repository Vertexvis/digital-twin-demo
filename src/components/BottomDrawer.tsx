import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import Link from "@material-ui/core/Link";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import TableChartOutlinedIcon from "@material-ui/icons/TableChartOutlined";
import TimelineOutlinedIcon from "@material-ui/icons/TimelineOutlined";
import clsx from "clsx";
import React from "react";

import { Sensor } from "../lib/time-series";
import { TimeSeriesChart } from "./TimeSeriesChart";
import { TimeSeriesDataGrid } from "./TimeSeriesData";

export type Content = "data" | "chart" | undefined;

interface Props {
  readonly content: Content;
  readonly onContent: (c: Content) => void;
  readonly onOpenSceneClick: () => void;
  readonly onSelect: (timestamp: string) => Promise<void>;
  readonly sensor: Sensor;
  readonly timestamp: string;
}

export const BottomDrawerHeight = 400;

const useStyles = makeStyles((theme) => ({
  drawer: {
    height: BottomDrawerHeight,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    height: BottomDrawerHeight,
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("height", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    height: theme.spacing(7) + 1,
  },
  mr: { marginRight: theme.spacing(2) },
  title: { textTransform: "uppercase" },
}));

export function BottomDrawer({
  content,
  onContent,
  onOpenSceneClick,
  onSelect,
  sensor,
  timestamp,
}: Props): JSX.Element {
  const { drawer, drawerOpen, drawerClose, mr, title } = useStyles();
  const open = Boolean(content);

  return (
    <Drawer
      anchor="bottom"
      className={clsx(drawer, { [drawerOpen]: open, [drawerClose]: !open })}
      classes={{ paper: clsx({ [drawerOpen]: open, [drawerClose]: !open }) }}
      open={open}
      variant="permanent"
    >
      <Box display="flex" justifyContent="space-between" mx={2} my={1}>
        <List
          style={{
            display: "flex",
            flexDirection: "row",
            padding: 0,
          }}
        >
          <ListItem
            button
            onClick={() => onContent(content === "data" ? undefined : "data")}
          >
            <TableChartOutlinedIcon
              color={content === "data" ? "primary" : undefined}
            />
          </ListItem>
          <ListItem
            button
            onClick={() => onContent(content === "chart" ? undefined : "chart")}
          >
            <TimelineOutlinedIcon
              color={content === "chart" ? "primary" : undefined}
            />
          </ListItem>
        </List>
        <Box>
          <Link
            className={mr}
            href="https://github.com/Vertexvis/digital-twin-demo"
            rel="noreferrer"
            style={{ alignSelf: "center" }}
            target="_blank"
          >
            View on GitHub
          </Link>
          <Button
            color="primary"
            onClick={() => onOpenSceneClick()}
            variant="contained"
          >
            Open Scene
          </Button>
        </Box>
      </Box>
      {content === "data" && (
        <>
          <Typography
            align="center"
            className={title}
            gutterBottom
            variant="subtitle1"
          >
            {sensor.meta.id} Data
          </Typography>
          <TimeSeriesDataGrid
            onSelect={onSelect}
            sensor={sensor}
            timestamp={timestamp}
          />
        </>
      )}
      {content === "chart" && (
        <Box overflow="hidden" height="100%" width="100%">
          <TimeSeriesChart sensor={sensor} />
        </Box>
      )}
    </Drawer>
  );
}
