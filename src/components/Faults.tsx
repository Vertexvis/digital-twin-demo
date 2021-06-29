import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import ErrorTwoToneIcon from "@material-ui/icons/ErrorTwoTone";
import WarningTwoToneIcon from "@material-ui/icons/WarningTwoTone";

import theme from "../lib/theme";
import { Faults as FaultsList } from "../lib/time-series";
import { NoData } from "./NoData";

export interface FaultProps {
  readonly onSelect: (timestamp: string) => void;
  readonly selected: string;
}

export function Faults({ onSelect, selected }: FaultProps): JSX.Element {
  return FaultsList.length > 0 ? (
    <List>
      {FaultsList.map((f) => {
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
                  style={{
                    color: theme.palette.warning.light,
                  }}
                />
              ) : (
                <ErrorTwoToneIcon
                  style={{
                    color: theme.palette.error.light,
                  }}
                />
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
