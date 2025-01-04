
import { Footer } from "../components/layout/footer";
import { Header } from "../components/layout/header";
import { NavBar } from "../components/layout/navBar";
import { useEffect, useState } from "react";
import { Home } from "../components/layout/home";
import { Page } from "../components/layout/page";
import { Calendar } from "../components/layout/calendar";

export function MainPage(): JSX.Element {
  const pageList: {pageName:string, component:any}[] = [
    {pageName:"home", component: Home}, 
    {pageName:"notice", component: Page}, 
    {pageName:"calendar", component: Calendar}, 
    {pageName:"user", component: Page}]
  const [pageIndex, setPageIndex] = useState<number>(0);
  const [pagesStyle, setPagesStyle] = useState({transform: `translateX(-${pageIndex * 100}vw)`})
  useEffect(() => {
    setPagesStyle({transform: `translateX(-${pageIndex * 100}vw)`})
  },[pageIndex])
  return <div className="layout">
    <main className="contents">
      {<Header />}
      <main>
        <div className="main-pages" style={pagesStyle}>
          {pageList.map((page, index)=>{
            return <page.component key={index} pageIndex={index} pageName={page.pageName}/>
          })}
        </div>
      </main>
      <Footer />
    </main>
    <NavBar setPageIndex={setPageIndex} pageList={pageList} pageIndex={pageIndex} />
  </div>
}