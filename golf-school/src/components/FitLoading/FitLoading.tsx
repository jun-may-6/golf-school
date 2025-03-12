import classNames from "classnames/bind";
import styles from "./fitLoading.module.scss";

export function FitLoading() {
  const cx = classNames.bind(styles);
  return <div className={cx("small-loading-container")}>
    <div className={cx("spinner")}></div>
  </div>
}