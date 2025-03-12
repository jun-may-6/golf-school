
import { BottomNav } from "../components/BottomNav/BottomNav";
import { useEffect, useState } from "react";
import { CalendarPage } from "../pages/CalendarPage";
import { Outlet, useOutlet } from "react-router-dom";
import { User } from "../pages/UserPage";
import styles from "./mainLayout.module.scss"
import classNames from "classnames/bind";
export function MainPage(): JSX.Element {
  const cx = classNames.bind(styles)


  const outlet = useOutlet();
  const pageList: { pageName: string, page: any }[] = [
    // { pageName: "home", page: Page },
    // { pageName: "notice", page: Page },
    { pageName: "calendar", page: CalendarPage },
    { pageName: "user", page: User }]
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pagesStyle, setPagesStyle] = useState({ transform: `translateX(-${pageIndex * 100}vw)` })
  useEffect(() => {
    setPagesStyle({ transform: `translateX(calc(var(--vw) * ${pageIndex * 100} * -1 ))` })
  }, [pageIndex])
  return <div className={cx("layout")}>
    <div className={cx("main-window")}>
        <div className={cx("main-pages")} style={pagesStyle}>
          {pageList.map((page, index) => {
            return <page.page key={index} pageIndex={index} pageName={page.pageName} />
          })}
        </div>
    </div>
    <BottomNav setPageIndex={setPageIndex} pageList={pageList} pageIndex={pageIndex} />
    {outlet &&
    <div className={cx("outlet")}>
      <Outlet />
    </div>
    }
  </div>
}