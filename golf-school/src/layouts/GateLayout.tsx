import classNames from "classnames/bind";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import styles from "./gateLayout.module.scss";
export function GateLayout(): JSX.Element {
  const cx = classNames.bind(styles);
  return <>
    <div className={cx("gate-logo-area")}>
      <div className={cx("container")}>
        <img src="/logo.png" alt="logo" />
        <div className={cx("title")}>
          편무일 골프 스쿨
        </div>
      </div>
    </div>
    <Outlet />
  </>
}