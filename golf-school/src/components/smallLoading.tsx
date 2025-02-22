export function SmallLoadingComponent({loadingMessage = "LOADING..."}:{loadingMessage?:string}) {
  return <div className="small-loading-container">
    <div className="spinner"></div>
  </div>
}