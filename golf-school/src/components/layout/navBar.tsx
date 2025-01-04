import { useEffect, useState } from "react"

export function NavBar({ pageList, pageIndex, setPageIndex }: { pageList: {pageName:string, component:any}[], pageIndex: number, setPageIndex: (index: number) => void }) {
  const [selectedTab, setSelectedTab] = useState("calendar")
  const onClickHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const clickedId = event.currentTarget.id;
    setSelectedTab(clickedId);
  }

  return <nav className="under-bar">
    {pageList.map((page, index) => {
      return <div
        key={index}
        className={pageIndex == index ? "item selected" : "item"}
        id={page.pageName}
        onClick={() => {
          setPageIndex(index)
        }}
      >
        <img src={`${page.pageName}.png`} />
      </div>
    })}
  </nav>
}