import { useEffect } from "react"
import "../animaion.css"
import ReactDOM from "react-dom"

export function GlobalLoading({ isLoading, loadingMessage = "LOADING" }: { isLoading: boolean, loadingMessage?: string }) {
  if (!isLoading) return

  return <div className="global-loading-background">
      <div className="global-loading-container">
        <div className="spinner"></div>
        <div className="loading-message">{loadingMessage}</div>
      </div>
    </div>
}