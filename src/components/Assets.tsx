import LayersIcon from "@mui/icons-material/Layers";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import { Asset } from "../lib/time-series";
import { NoData } from "./NoData";

export interface AssetProps {
  readonly assets: Asset[];
  readonly onSelect: (asset: Asset) => void;
  readonly selected: Asset;
}

export function Assets({
  assets,
  onSelect,
  selected,
}: AssetProps): JSX.Element {
  return assets.length > 0 ? (
    <List>
      {assets.map((a) => {
        const isSelected = a === selected;
        return (
          <ListItem
            button
            key={a}
            onClick={() => onSelect(a)}
            selected={isSelected}
          >
            <ListItemIcon>
              <LayersIcon color="action" />
            </ListItemIcon>
            <ListItemText primary={a} />
          </ListItem>
        );
      })}
    </List>
  ) : (
    <NoData />
  );
}
