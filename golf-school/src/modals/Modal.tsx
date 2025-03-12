import classNames from "classnames/bind";
import { ReactNode, useEffect } from "react";
import ReactDOM from "react-dom";
import styles from "./modal.module.scss"
let modalRoot: HTMLElement | null = null;

export function Modal({
  isOpen,
  children,
  onRequestClose = () => {}
}: {
  isOpen: boolean;
  children: ReactNode;
  onRequestClose?: () => void
}) {
  const cx = classNames.bind(styles)
  useEffect(() => {
    if (!modalRoot) {
      const layoutElement = document.querySelector(".mobile-view");
      modalRoot = document.createElement("div");
      modalRoot.classList.add(cx("root"))

      if (layoutElement) {
        layoutElement.appendChild(modalRoot);
      } else {
        document.body.appendChild(modalRoot); // layout이 없으면 body에 추가 (예외 처리)
      }
    }
  }, []);

  if (!isOpen || !modalRoot) return null;

  return ReactDOM.createPortal(
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          e.stopPropagation();
          onRequestClose();
        }
      }}
      className={cx("overlay")}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cx("modal")}
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
}
