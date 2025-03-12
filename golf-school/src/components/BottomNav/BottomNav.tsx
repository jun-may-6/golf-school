import { useEffect, useState } from "react"
import styles from "./bottomNav.module.scss"
import classNames from "classnames/bind"
export function BottomNav({ pageList, pageIndex, setPageIndex }: { pageList: {pageName:string, page:any}[], pageIndex: number, setPageIndex: (index: number) => void }) {
  const cx = classNames.bind(styles)
  return <nav className={cx("bottom-nav")}>
    {pageList.map((page, index) => {
      return <div
        key={index}
        className={cx("item", {selected: pageIndex == index})}
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