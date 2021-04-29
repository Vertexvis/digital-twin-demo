import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";
import { useSetRecoilState } from "recoil";
import { openSceneDialogOpenState } from "../lib/state";

export function Header(): JSX.Element {
  const setOpen = useSetRecoilState(openSceneDialogOpenState);

  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Button color="primary" onClick={() => setOpen(true)} variant="contained">
        Open Scene
      </Button>
      <Link
        href="https://github.com/Vertexvis/time-series-demo"
        rel="noreferrer"
        style={{ alignSelf: "center" }}
        target="_blank"
      >
        View on GitHub
      </Link>
    </Box>
  );
}
