import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import React from "react";

import { formatValue, Sensor } from "../lib/time-series";

interface Props {
  readonly onSelect: (timestamp: string) => Promise<void>;
  readonly sensor: Sensor;
  readonly timestamp: string;
}

const columns: GridColDef[] = [
  { field: "id", headerName: "Timestamp", flex: 1 },
  { field: "min", headerName: "Minimum", flex: 1 },
  { field: "max", headerName: "Maximum", flex: 1 },
  { field: "avg", headerName: "Average", flex: 1 },
  {
    field: "std",
    headerName: "Standard Deviation",
    flex: 1,
  },
];

export function TimeSeriesDataGrid({
  onSelect,
  sensor,
  timestamp,
}: Props): JSX.Element {
  return (
    <Box display="flex" flexGrow={1}>
      <DataGrid
        disableColumnMenu
        disableColumnSelector
        disableDensitySelector
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        disableMultipleSelection
        hideFooter
        columns={columns}
        onStateChange={(e) => {
          const ts = e.focus.cell?.id as string;
          if (ts == null) return;

          onSelect(ts);
        }}
        rows={sensor.data.map((d) => ({
          id: d.timestamp,
          min: formatValue(d.min),
          max: formatValue(d.max),
          avg: formatValue(d.avg),
          std: formatValue(d.std),
        }))}
        selectionModel={[timestamp]}
      />
    </Box>
  );
}
