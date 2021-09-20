import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import React from "react";

export function NoData(): JSX.Element {
  return (
    <Box sx={{ mx: 2, mb: 2 }}>
      <Typography variant="body2">No data</Typography>
    </Box>
  );
}
