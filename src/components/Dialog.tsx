import React, {
  FunctionComponent,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { Icon } from './Icon';

interface Props {
  /**
   * A React element or string that this dialog will render.
   */
  readonly children: ReactNode;

  /**
   * A React element or string that this dialog will render as a header.
   */
  readonly header: ReactNode;

  /**
   * A React element or string that this dialog will render as a footer.
   */
  readonly footer: ReactNode;

  /**
   * A boolean value indicating that the dialog is opened
   */
  readonly open: boolean;

  /**
   * A function to close the dialog
   */
  readonly onClose: VoidFunction;

  /**
   * A function to close the dialog
   */
  readonly onBackdropClick?: VoidFunction;
}

export const Dialog: FunctionComponent<Props> = ({
  children,
  footer,
  header,
  open,
  onClose,
  onBackdropClick,
}: Props): JSX.Element => {
  const mainClass = `
    flex items-end justify-center 
    min-h-screen 
    pt-4 px-4 pb-20 
    text-center 
    sm:block sm:p-0
  `;

  if (!open) {
    return <div data-testid="empty-common-dialog" />;
  }

  const escFunction = useCallback((event) => {
    if (event.keyCode === 27) {
      onClose();
    }
  }, []);

  useEffect(() => {
    window.document.addEventListener('keydown', escFunction, false);

    return () => {
      window.document.removeEventListener('keydown', escFunction, false);
    };
  }, []);

  return (
    <div
      data-testid="common-dialog"
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className={mainClass}>
        <div
          className="fixed inset-0 transition-opacity"
          onClick={onBackdropClick}
        >
          <div className="absolute inset-0 bg-gray-800 opacity-50"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
        &#8203;
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div
            className="w-4 h-4 p-0.5 absolute rounded-sm top-4 right-4 text-gray-700 hover:bg-gray-300 hover:text-gray-800 cursor-pointer"
            onClick={onClose}
          >
            <Icon icon="close" />
          </div>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div>
              <div className="hdr-800">{header}</div>
              <div className="text-gray-700 text-sm">{children}</div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse text-sm">
            {footer}
          </div>
        </div>
      </div>
    </div>
  );
};
