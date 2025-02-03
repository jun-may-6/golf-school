// Modal.tsx
import { ReactNode, useEffect, useRef } from "react";
import ReactDOM from "react-dom";

let modalRoot: HTMLElement | null = null;

export function Modal({
  isOpen,
  children,
  onRequestClose = () => {},
  zIndex = 10
}: {
  isOpen: boolean;
  children: ReactNode;
  onRequestClose?: () => void;
  zIndex?: number
}) {
  // 모든 모달이 공유하는 단일 modalRoot 사용
  useEffect(() => {
    if (!modalRoot) {
      modalRoot = document.createElement("div");
      modalRoot.id = "modal-root";
      document.body.appendChild(modalRoot);
    }
  }, []);

  if (!isOpen || !modalRoot) return null;
  const baseZindex = zIndex * 2;

  return ReactDOM.createPortal(
    <div
      onClick={(e) => {
        // 현재 모달의 overlay를 클릭했을 때만 닫히도록 수정
        if (e.target === e.currentTarget) {
          e.stopPropagation(); // 이벤트 버블링 중지
          onRequestClose();
        }
      }}
      className="modal-overlay"
      style={{
        zIndex: baseZindex
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="modal-content"
        style={{
          zIndex: baseZindex + 1
        }}
      >
        {children}
      </div>
    </div>,
    modalRoot
  );
}