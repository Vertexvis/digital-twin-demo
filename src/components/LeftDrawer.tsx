import { makeStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import TableChartIcon from "@material-ui/icons/TableChart";
import TimelineIcon from "@material-ui/icons/Timeline";
import { useRecoilState } from "recoil";
import { LeftDrawerWidth } from "./Layout";
import { bottomDrawerContentState } from "../lib/state";

const useStyles = makeStyles(() => ({
  paper: {
    position: "relative",
    width: LeftDrawerWidth,
  },
}));

export function LeftDrawer(): JSX.Element {
  const { paper } = useStyles();
  const [content, setContent] = useRecoilState(bottomDrawerContentState);

  return (
    <Drawer anchor="left" variant="permanent" classes={{ paper }}>
      <List>
        <ListItem
          button
          onClick={() => setContent(content === "data" ? undefined : "data")}
        >
          <ListItemIcon>
            <TableChartIcon
              color={content === "data" ? "primary" : undefined}
            />
          </ListItemIcon>
        </ListItem>
        <ListItem
          button
          onClick={() => setContent(content === "chart" ? undefined : "chart")}
        >
          <ListItemIcon>
            <TimelineIcon color={content === "chart" ? "primary" : undefined} />
          </ListItemIcon>
        </ListItem>
      </List>
    </Drawer>
  );
}
