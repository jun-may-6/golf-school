import { useEffect } from "react"
import { callApi } from "../apis/api"
import { useNavigate } from "react-router-dom"
import styles from "./userPage.module.scss";
import classNames from "classnames/bind";
import { useAppSelector } from "../store";

export function User({ pageIndex, pageName }: { pageIndex: number, pageName: string }): JSX.Element {
  const cx = classNames.bind(styles);
  const navigate = useNavigate();
  const userInfo = useAppSelector(state => state.userInfo);

  const logout = async () => {
    try {
      const response = await callApi.delete("/users/jwt-tokens")
      if (response.status == 200) {
        alert("로그아웃 완료")
        navigate("/gate/login")
      }
    } catch {
      alert("로그아웃 실패")
    }
  }
  return <div
    className={cx("container")}>
    <header>
      <div className={cx("header-left-side")}></div>
      <div className={cx("header-center")}>
        마이 페이지
      </div>
      <div className={cx("header-right-side")}></div>
    </header>
    <div className={cx("main")}>
      <div className={cx("profile")}>
        <img className={cx("profile-image")} src={userInfo.gender == "남" ? "/icon/male.png" : "/icon/female.png"} />
        <div className={cx("user-info")}>
          <div className={cx("name")}>{userInfo.name}</div>
          <div className={cx("user-id")}>{userInfo.userId}</div>
        </div>
      </div>
      <button disabled={true}>
        회원정보 수정
        <img src="/icon/arrow.png"/>
      </button>
      <button disabled={true}>
        비밀번호 수정
        <img src="/icon/arrow.png"/>
      </button>
      {userInfo.accessLevel == "ADMIN" && <>
        <button disabled={true}>
        회원 관리
        <img src="/icon/arrow.png"/>
      </button>
      </>}
      <button onClick={logout}>
        로그아웃
        <img src="/icon/arrow.png"/>
      </button>
    </div>
  </div>
}