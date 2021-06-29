import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import React from "react";

export const RightDrawerWidth = 320;

interface Props {
  readonly bottomDrawer: React.ReactNode;
  readonly children: React.ReactNode;
  readonly main: React.ReactNode;
  readonly rightDrawer: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  content: {
    height: "100%",
    width: `calc(100% - ${RightDrawerWidth}px)`,
    [theme.breakpoints.down("sm")]: {
      width: `100%`,
    },
  },
}));

export function Layout({
  bottomDrawer,
  children,
  main,
  rightDrawer,
}: Props): JSX.Element {
  const { content } = useStyles();

  return (
    <Box height="100vh" display="flex">
      <main className={content}>{main}</main>
      <Hidden smDown>{rightDrawer}</Hidden>
      {children}
      {bottomDrawer}
    </Box>
  );
}
