import { useEffect, useState } from "react"

export function Page({ pageIndex, pageName }: { pageIndex: number, pageName: string }): JSX.Element {

  useEffect(() => {

  }, [])
  return <div
    className="main-page">
    <header>
      <div className="header-left-side"></div>
      <div className="header-center">
      <div className="header-right-side"></div>
        {pageName}
      </div>
    </header>
    <div style={{ width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", opacity: "0.6" }}>
      <div style={{ width: "30%", height: "40%" }}>
        <img src="icon/fixed.png" style={{ objectFit: "cover", width: "100%" }}></img>
        <div className="update-message" style={{ fontSize: "0.7rem", textAlign: "center" }}>업데이트 준비중</div>
      </div>
    </div>
  </div>
  {/* {pageList.map((pageName, index) => {
        return <div
          key={index}
          className="main-page">
          {pageName}
        </div>
      })} */}
}