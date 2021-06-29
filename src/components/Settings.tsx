import { Box, FormControlLabel, FormGroup, Switch } from "@material-ui/core";
import React from "react";

export interface SettingsProps {
  ghosted: boolean;
  onGhostToggle: (checked: boolean) => void;
}

export function Settings({
  ghosted,
  onGhostToggle,
}: SettingsProps): JSX.Element {
  return (
    <Box mb={2} mx={2}>
      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              color="primary"
              checked={ghosted}
              onChange={(e) => onGhostToggle(e.target.checked)}
            />
          }
          label="Ghosted geometry"
        />
      </FormGroup>
    </Box>
  );
}
