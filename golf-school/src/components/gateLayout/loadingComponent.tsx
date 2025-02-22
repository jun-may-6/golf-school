

export function LoadingComponent({loadingMessage = "LOADING..."}:{loadingMessage?:string}) {
  return <div className="loading-container">
    <div className="spinner"></div>
    <div className="loading-message">{loadingMessage}</div>
  </div>
}