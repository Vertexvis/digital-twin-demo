import ErrorTwoToneIcon from "@mui/icons-material/ErrorTwoTone";
import WarningTwoToneIcon from "@mui/icons-material/WarningTwoTone";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Typography from "@mui/material/Typography";

import theme from "../lib/theme";
import { FaultCode } from "../lib/time-series";
import { NoData } from "./NoData";

export interface FaultProps {
  readonly faults: FaultCode[];
  readonly onSelect: (timestamp: string) => void;
  readonly selected: string;
}

export function Faults({
  faults,
  onSelect,
  selected,
}: FaultProps): JSX.Element {
  return faults.length > 0 ? (
    <List>
      {faults.map((f) => {
        const isSelected = f.timestamp === selected;
        return (
          <ListItem
            button
            key={f.id}
            onClick={() => onSelect(f.timestamp)}
            selected={isSelected}
          >
            <ListItemIcon>
              {f.severity === "warn" ? (
                <WarningTwoToneIcon
                  sx={{ color: theme.palette.warning.light }}
                />
              ) : (
                <ErrorTwoToneIcon sx={{ color: theme.palette.error.light }} />
              )}
            </ListItemIcon>
            <ListItemText primary={f.title} />
            <Typography variant="body2">
              {f.timestamp.substring(11, 19)}
            </Typography>
          </ListItem>
        );
      })}
    </List>
  ) : (
    <NoData />
  );
}
