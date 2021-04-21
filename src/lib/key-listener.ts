import React from "react";
import { useSetRecoilState } from "recoil";
import { openSceneDialogOpenState } from "./state";

interface Keys {
  readonly alt: boolean;
}

export function useKeyListener(): Keys {
  const setDialogOpen = useSetRecoilState(openSceneDialogOpenState);
  const [keys, setKeys] = React.useState<Keys>({ alt: false });

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return function cleanup() {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  function handleKeyDown(e: KeyboardEvent): void {
    handle(e, true);
  }

  function handleKeyUp(e: KeyboardEvent): void {
    handle(e, false);
  }

  function handle(e: KeyboardEvent, down: boolean): void {
    if (e.altKey) setKeys({ ...keys, alt: down });
    else if (e.key === "o" && down) setDialogOpen(true);
  }

  return keys;
}
