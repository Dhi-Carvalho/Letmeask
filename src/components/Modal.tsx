import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useHistory, useParams } from "react-router-dom";

import danger from "../assets/images/danger.svg";
import { database } from "../services/firebase";

import "../styles/modal.scss";

type RoomParams = {
  id: string;
};

interface ModalProps {
  isShowing: boolean;
  toggle: () => void;
}

const Modal: React.FC<ModalProps> = ({ isShowing, toggle }) => {
  const history = useHistory();
  const params = useParams<RoomParams>();
  const roomId = params.id;

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

  async function handleEndRoom() {
    await database.ref(`rooms/${roomId}`).update({
      endedAt: new Date(),
    });

    history.push("/");
  }

  return isShowing
    ? ReactDOM.createPortal(
        <div className="modal-overlay">
          <div className="modal-wrapper">
            <div className="modal">
              <img src={danger} alt="Ação Perigosa" />
              <h1>Encerrar sala</h1>
              <p>Tem certeza que você deseja encerrar esta sala?</p>
              <div className="buttons">
                <button className="cancel" onClick={toggle}>
                  Cancelar
                </button>
                <button className="delete" onClick={handleEndRoom}>
                  Sim, encerrar
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;
};

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
