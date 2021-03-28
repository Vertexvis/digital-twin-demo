import React, { ChangeEvent, useEffect, useState } from 'react';
import { Dialog } from './Dialog';

interface Props {
  readonly clientId?: string;
  readonly streamKey?: string;
  readonly open: boolean;
  readonly onClose: VoidFunction;
  readonly onConfirm: (clientId: string, streamKey: string) => void;
}

export function LoadStreamKeyDialog({
  clientId,
  streamKey,
  open,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const [inputClientId, setInputClientId] = useState(clientId ?? '');
  const [inputStreamKey, setInputStreamKey] = useState(streamKey ?? '');

  const handleDialogClose = (): void => onClose();

  useEffect(() => {
    if (clientId) setInputClientId(clientId);
    if (streamKey) setInputStreamKey(streamKey);
  }, [clientId, streamKey, setInputClientId, setInputStreamKey]);

  return (
    <Dialog
      header="Open Scene"
      footer={
        <>
          <button
            className="btn btn-primary"
            disabled={inputClientId === '' || inputStreamKey === ''}
            onClick={() => {
              if (inputClientId && inputStreamKey) {
                onConfirm(inputClientId, inputStreamKey);
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
                value={inputClientId}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setInputClientId(event.target.value);
                }}
              />
            </div>
            <div className="py-2">
              <input
                placeholder="Stream Key"
                className="txt-input"
                type="text"
                value={inputStreamKey}
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  setInputStreamKey(event.target.value);
                }}
              />
            </div>
          </>
        }
      </div>
    </Dialog>
  );
}
