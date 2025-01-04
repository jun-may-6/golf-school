import { useEffect, useState } from "react"

export function Page({ pageIndex, pageName }: { pageIndex: number, pageName: string }): JSX.Element {

  useEffect(() => {

  }, [])
  return <div
    className="main-page">
    {pageName}
  </div>
  {/* {pageList.map((pageName, index) => {
        return <div
          key={index}
          className="main-page">
          {pageName}
        </div>
      })} */}
}