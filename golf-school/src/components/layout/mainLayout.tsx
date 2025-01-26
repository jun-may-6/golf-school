import { Footer } from "./footer";
import { NavBar } from "./navBar";
import { useEffect, useState } from "react";
import { Home } from "./home";
import { Page } from "./page";
import { CalendarPage } from "../../pages/calendarPage";
import { Outlet, useOutlet } from "react-router-dom";

export function MainPage(): JSX.Element {
  const outlet = useOutlet();
  const pageList: { pageName: string, component: any }[] = [
    { pageName: "home", component: Home },
    { pageName: "notice", component: Page },
    { pageName: "calendar", component: CalendarPage },
    { pageName: "user", component: Page }]
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
        <Footer />
      </main>
      <NavBar setPageIndex={setPageIndex} pageList={pageList} pageIndex={pageIndex} />
    </div>
  </>
}