
import { NavBar } from "./navBar";
import { useEffect, useState } from "react";
import { Page } from "./page";
import { CalendarPage } from "../../pages/calendarPage";
import { Outlet, useOutlet } from "react-router-dom";
import { User } from "./user";

export function MainPage(): JSX.Element {
  const outlet = useOutlet();
  const pageList: { pageName: string, component: any }[] = [
    { pageName: "home", component: Page },
    { pageName: "notice", component: Page },
    { pageName: "calendar", component: CalendarPage },
    { pageName: "user", component: User }]
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pagesStyle, setPagesStyle] = useState({ transform: `translateX(-${pageIndex * 100}vw)` })
  useEffect(() => {
    setPagesStyle({ transform: `translateX(-${pageIndex * 100}vw)` })
  }, [pageIndex])
  return <>
    <div className="layout">
      <main className="contents">
        <main>
          <div className="main-pages" style={pagesStyle}>
            {pageList.map((page, index) => {
              return <page.component key={index} pageIndex={index} pageName={page.pageName} />
            })}
          </div>
        </main>
      </main>
      <NavBar setPageIndex={setPageIndex} pageList={pageList} pageIndex={pageIndex} />
    </div>
    <Outlet/>
  </>
}