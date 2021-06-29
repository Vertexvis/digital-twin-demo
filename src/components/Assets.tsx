import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import LayersIcon from "@material-ui/icons/Layers";

import { Asset, Assets as AssetList } from "../lib/time-series";
import { NoData } from "./NoData";

export interface AssetProps {
  readonly selected: Asset;
  readonly onSelect: (asset: Asset) => void;
}

export function Assets({ selected, onSelect }: AssetProps): JSX.Element {
  return AssetList.length > 0 ? (
    <List>
      {AssetList.map((a) => {
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
