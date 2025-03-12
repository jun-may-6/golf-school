import classNames from "classnames/bind";
import styles from "./globalLoading.module.scss";

export function GlobalLoading({ isLoading, loadingMessage = "LOADING" }: { isLoading: boolean, loadingMessage?: string }) {
  const cx = classNames.bind(styles);
  if (!isLoading) return null;

  return (
    <div className={cx("overlay")}>
      <div className={cx("container")}>
        <div className={cx("spinner")}></div>
        <div className={cx("message")}>
          {loadingMessage.split("\n").map((line, index) => (
            <span key={index}>
              {line}
              <br />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
