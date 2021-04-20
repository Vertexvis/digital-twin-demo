import React from "react";

interface Keys {
  readonly alt: boolean;
  readonly o: boolean;
}

export function useKeyListener(): Keys {
  const [keys, setKeys] = React.useState<Keys>({ alt: false, o: false });

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
    else if (e.key === "o") setKeys({ ...keys, o: down });
  }

  return keys;
}
