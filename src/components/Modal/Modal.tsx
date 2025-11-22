import { MouseEvent, ReactNode, useEffect } from "react";
import css from "./Modal.module.css";
import { createPortal } from "react-dom";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (evt: KeyboardEvent) => {
      if (evt.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);
  const handleBackDropClick = (evt: MouseEvent<HTMLDivElement>) => {
    if (evt.target === evt.currentTarget) onClose();
  };
  return createPortal(
    <div className={css.backdrop} role="dialog" aria-modal="true" onClick={handleBackDropClick}>
      <div className={css.modal}>{children}</div>
    </div>,
    document.body
  );
}
