import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";

const DenseToolbarHeight = 48;
export const LeftDrawerWidth = 73;
export const RightDrawerWidth = 320;

interface Props {
  readonly bottomDrawer: React.ReactNode;
  readonly children: React.ReactNode;
  readonly header: React.ReactNode;
  readonly leftDrawer: React.ReactNode;
  readonly main: React.ReactNode;
  readonly rightDrawer: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginLeft: LeftDrawerWidth,
    marginRight: RightDrawerWidth,
    width: `calc(100% - ${LeftDrawerWidth + RightDrawerWidth}px)`,
    zIndex: theme.zIndex.drawer + 1,
    [theme.breakpoints.down("sm")]: {
      margin: 0,
      width: `100%`,
    },
  },
  content: {
    height: `calc(100% - ${DenseToolbarHeight}px)`,
    width: `calc(100% - ${LeftDrawerWidth + RightDrawerWidth}px)`,
    [theme.breakpoints.down("sm")]: {
      width: `100%`,
    },
  },
}));

export function Layout({
  bottomDrawer,
  children,
  header,
  leftDrawer,
  main,
  rightDrawer,
}: Props): JSX.Element {
  const { appBar, content } = useStyles();

  return (
    <Box height="100vh" display="flex">
      <AppBar position="fixed" elevation={1} color="default" className={appBar}>
        <Toolbar variant="dense">{header}</Toolbar>
      </AppBar>
      <Hidden smDown>{leftDrawer}</Hidden>
      <main className={content}>
        <Box minHeight={`${DenseToolbarHeight}px`} />
        {main}
      </main>
      <Hidden smDown>{rightDrawer}</Hidden>
      {children}
      {bottomDrawer}
    </Box>
  );
}
