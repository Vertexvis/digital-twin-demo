import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { SensorsToItemSuppliedIds } from "../lib/time-series";

export interface MappingProps {
  readonly mapping: SensorsToItemSuppliedIds;
  readonly onChange: (mapping: SensorsToItemSuppliedIds) => void;
}

export function Mapping({ mapping, onChange }: MappingProps): JSX.Element {
  const [map, setMap] = React.useState(JSON.stringify(mapping, null, 2));

  return (
    <Box mx={2} mb={2}>
      <Box mb={2}>
        <TextField
          defaultValue={map}
          fullWidth
          multiline
          onChange={(e) => setMap(e.target.value)}
          rowsMax={28}
          style={{
            fontFamily:
              "Consolas, Menlo, Monaco, source-code-pro, Courier New, monospace",
          }}
        />
      </Box>
      <Button
        onClick={() => {
          try {
            onChange(JSON.parse(map));
          } catch (error) {
            // ignore
          }
        }}
        variant="contained"
      >
        Update Mapping
      </Button>
    </Box>
  );
}
