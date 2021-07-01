import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LayersIcon from "@material-ui/icons/Layers";

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
