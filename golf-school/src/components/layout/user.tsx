import { useEffect } from "react"
import { callApi } from "../../apis/api"
import { useNavigate } from "react-router-dom"

export function User({ pageIndex, pageName }: { pageIndex: number, pageName: string }): JSX.Element {
  const navigate = useNavigate();
  const logout = async () => {
    try {
      const response = await callApi.delete("/users/jwt-tokens")
      if(response.status == 200) {
        alert("로그아웃 완료")
        navigate("/gate/login")
      }
    } catch {
      alert("로그아웃 실패")
    }
  }
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
      <div style={{ width: "30%", height: "40%", textAlign: "center" }}>
        <img src="icon/fixed.png" style={{ objectFit: "cover", width: "100%" }}></img>
        <div className="update-message" style={{ fontSize: "0.7rem", textAlign: "center" }}>업데이트 준비중</div>
        <button style={{}}
          onClick={() => {logout()}}
        >로그아웃</button>
      </div>
    </div>
  </div>
}