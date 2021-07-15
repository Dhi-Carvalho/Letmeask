import { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import "../styles/modal.scss";

interface ModalProps {
  isShowing: boolean;
  toggle: () => void;
}

const Modal: React.FC<ModalProps> = ({ isShowing, toggle, children }) => {
  useEffect(() => {
    const listener = function (e: KeyboardEvent) {
      if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
        e.preventDefault();
        e.stopPropagation();

        isShowing && toggle();
      }
    };

    window.addEventListener("keyup", listener);

    return () => {
      window.removeEventListener("keyup", listener);
    };
  }, [isShowing, toggle]);

  return isShowing
    ? ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-wrapper">
            <div className="modal">{children}</div>
          </div>
        </div>,
        document.body
      )
    : null;
};

interface ModalFooterProps {
  toggle: () => void;
}

export const ModalBody: React.FC = ({ children }) => (
  <div className="modal-body">{children}</div>
);

export const ModalFooter: React.FC<ModalFooterProps> = ({
  toggle,
  children,
}) => <div className="modal-footer">{children}</div>;

export const useModal = () => {
  const [isShowing, setIsShowing] = useState(false);

  function toggle() {
    setIsShowing(!isShowing);
  }

  return {
    isShowing,
    toggle,
  };
};

export default Modal;
