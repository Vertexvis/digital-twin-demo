import TableChartOutlinedIcon from "@mui/icons-material/TableChartOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Drawer, { drawerClasses } from "@mui/material/Drawer";
import Link from "@mui/material/Link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import React from "react";

import { Sensor } from "../lib/time-series";
import { sharpEntering, sharpLeaving } from "../lib/transitions";
import { BottomDrawerHeight } from "./Layout";
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

export function BottomDrawer({
  content,
  onContent,
  onOpenSceneClick,
  onSelect,
  sensor,
  timestamp,
}: Props): JSX.Element {
  const open = Boolean(content);

  return (
    <Drawer
      anchor="bottom"
      open={open}
      sx={{
        height: BottomDrawerHeight,
        flexShrink: 0,
        whiteSpace: "nowrap",
        [`& .${drawerClasses.paper}`]: open
          ? {
              height: BottomDrawerHeight,
              transition: (theme) =>
                theme.transitions.create("height", sharpEntering(theme)),
            }
          : {
              height: "57px",
              overflowX: "hidden",
              transition: (theme) =>
                theme.transitions.create("height", sharpLeaving(theme)),
            },
      }}
      variant="permanent"
    >
      <Box display="flex" justifyContent="space-between" mx={2} my={1}>
        <List
          sx={{
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
            href="https://github.com/Vertexvis/digital-twin-demo"
            rel="noreferrer"
            sx={{ alignSelf: "center", mr: 2 }}
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
            sx={{ textTransform: "uppercase" }}
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
