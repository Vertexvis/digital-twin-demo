import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TableChartIcon from "@material-ui/icons/TableChart";
import TimelineIcon from "@material-ui/icons/Timeline";
import { Content } from "./BottomDrawer";
import { LeftDrawerWidth } from "./Layout";

interface Props {
  readonly selected?: Content;
  readonly onSelect: (content?: Content) => void;
}

const useStyles = makeStyles(() => ({
  paper: {
    position: "relative",
    width: LeftDrawerWidth,
  },
}));

export function LeftDrawer({ selected, onSelect }: Props): JSX.Element {
  const { paper } = useStyles();

  return (
    <Drawer anchor="left" variant="permanent" classes={{ paper }}>
      <List>
        <ListItem
          button
          onClick={() => onSelect(selected === "data" ? undefined : "data")}
        >
          <ListItemIcon>
            <TableChartIcon
              color={selected === "data" ? "primary" : undefined}
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          onClick={() => onSelect(selected === "chart" ? undefined : "chart")}
        >
          <ListItemIcon>
            <TimelineIcon
              color={selected === "chart" ? "primary" : undefined}
            />
          </ListItemIcon>
        </ListItem>
      </List>
    </Drawer>
  );
}
