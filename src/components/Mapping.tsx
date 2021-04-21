import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import React from "react";
import { useRecoilState } from "recoil";
import { sensorMappingState } from "../lib/state";

export function Mapping(): JSX.Element {
  const [mapping, setMapping] = useRecoilState(sensorMappingState);
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
            setMapping(JSON.parse(map));
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
