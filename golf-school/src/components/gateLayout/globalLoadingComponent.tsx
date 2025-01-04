import { useEffect } from "react"
import "../animaion.css"

export function GlobalLoadingComponent({loadingMessage = "LOADING"}:{loadingMessage?:string}) {
  useEffect(() => {
    /* 로딩상태 ture 로직 */
  },[])
  return <div className="global-loading-container">
    <div className="spinner"></div>
    <div className="loading-message">{loadingMessage}</div>
  </div>
}