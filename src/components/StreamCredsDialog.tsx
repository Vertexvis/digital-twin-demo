import React, { ChangeEvent, useEffect, useState } from 'react';
import { Dialog } from './Dialog';

export interface StreamCreds {
  clientId: string;
  streamKey: string;
}

interface Props {
  readonly creds: StreamCreds;
  readonly open: boolean;
  readonly onClose: VoidFunction;
  readonly onConfirm: (creds: StreamCreds) => void;
}

export function StreamCredsDialog({
  creds,
  open,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const [inputCreds, setInputCreds] = useState<StreamCreds>(creds);
  const handleDialogClose = (): void => onClose();

  useEffect(() => {
    if (creds.clientId || creds.streamKey) setInputCreds(creds);
  }, [creds]);

  return (
    <Dialog
      header="Open Scene"
      footer={
        <>
          <button
            className="btn btn-primary"
            disabled={inputCreds.clientId === '' || inputCreds.streamKey === ''}
            onClick={() => {
              if (inputCreds.clientId && inputCreds.streamKey) {
                onConfirm(inputCreds);
              }
            }}
          >
            Open Scene
          </button>
          <button className="btn btn-secondary" onClick={handleDialogClose}>
            Cancel
          </button>
        </>
      }
      open={open}
      onClose={handleDialogClose}
    >
      <div data-testid="dialog-content">
        {
          <>
            Enter the Client ID and stream key to view and edit your scene.
            <div className="py-2">
              <input
                placeholder="Client ID"
                className="txt-input"
                type="text"
                value={inputCreds.clientId}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setInputCreds({
                    ...inputCreds,
                    clientId: event.target.value,
                  });
                }}
              />
            </div>
            <div className="py-2">
              <input
                placeholder="Stream Key"
                className="txt-input"
                type="text"
                value={inputCreds.streamKey}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setInputCreds({
                    ...inputCreds,
                    streamKey: event.target.value,
                  });
                }}
              />
            </div>
          </>
        }
      </div>
    </Dialog>
  );
}
